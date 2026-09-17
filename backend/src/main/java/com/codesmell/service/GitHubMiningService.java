package com.codesmell.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GitHubMiningService {

    private final WebClient webClient;
    private static final Pattern GITHUB_URL_PATTERN = Pattern.compile(
            "https://github\\.com/([^/]+)/([^/]+)(?:\\.git)?/?$"
    );

    public GitHubMiningService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String[] parseGithubUrl(String url) {
        Matcher matcher = GITHUB_URL_PATTERN.matcher(url);
        if (matcher.matches()) {
            String owner = matcher.group(1);
            String repo = matcher.group(2).replaceAll("\\.git$", "");
            return new String[]{owner, repo};
        }
        return null;
    }

    public List<Map<String, Object>> mineCommits(String repoUrl, Integer maxCommits, String githubToken) {
        String[] parts = parseGithubUrl(repoUrl);
        if (parts == null) {
            throw new IllegalArgumentException("Invalid GitHub URL: " + repoUrl);
        }

        String owner = parts[0];
        String repo = parts[1];
        List<Map<String, Object>> allCommits = new ArrayList<>();
        int page = 1;
        int perPage = 30;

        while (allCommits.size() < maxCommits) {
            List<Map<String, Object>> pageCommits = fetchCommitsPage(owner, repo, page, perPage, githubToken);
            if (pageCommits == null || pageCommits.isEmpty()) {
                break;
            }

            for (Map<String, Object> commit : pageCommits) {
                if (allCommits.size() >= maxCommits) {
                    break;
                }
                try {
                    Map<String, Object> enrichedCommit = enrichCommitWithDetails(
                            commit, owner, repo, githubToken
                    );
                    allCommits.add(enrichedCommit);
                } catch (Exception e) {
                    // Skip this commit on error
                }
            }

            if (pageCommits.size() < perPage) {
                break;
            }

            page++;
        }

        return allCommits;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchCommitsPage(String owner, String repo, int page,
                                                        int perPage, String githubToken) {
        try {
            String uri = String.format(
                    "https://api.github.com/repos/%s/%s/commits?per_page=%d&page=%d",
                    owner, repo, perPage, page
            );

            var builder = webClient.get().uri(uri)
                    .header("Accept", "application/vnd.github.v3+json");

            if (githubToken != null && !githubToken.isEmpty()) {
                builder = builder.header("Authorization", "Bearer " + githubToken);
            }

            return builder.retrieve()
                    .bodyToMono(List.class)
                    .block();
        } catch (Exception e) {
            System.err.println("GitHub API Error fetching commits from " + owner + "/" + repo + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> enrichCommitWithDetails(Map<String, Object> commitListItem,
                                                         String owner, String repo, String githubToken) {
        Map<String, Object> commit = new LinkedHashMap<>(commitListItem);

        // Extract basic info
        Map<String, Object> commitData = (Map<String, Object>) commit.get("commit");
        Map<String, Object> authorData = (Map<String, Object>) commitData.get("author");
        String message = (String) commitData.get("message");
        String author = (String) authorData.get("name");
        String sha = (String) commit.get("sha");

        String committedAtStr = (String) authorData.get("date");
        LocalDateTime committedAt = parseGithubTimestamp(committedAtStr);

        // Fetch detailed stats via the commit detail endpoint
        String detailUrl = (String) commit.get("url");
        Map<String, Object> details = fetchCommitDetails(detailUrl, githubToken);

        int additions = 0;
        int deletions = 0;
        int filesChanged = 0;

        if (details != null) {
            additions = ((Number) details.getOrDefault("additions", 0)).intValue();
            deletions = ((Number) details.getOrDefault("deletions", 0)).intValue();

            List<Map<String, Object>> files = (List<Map<String, Object>>) details.get("files");
            filesChanged = files != null ? files.size() : 0;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("sha", sha);
        result.put("message", message);
        result.put("author", author);
        result.put("committed_at", committedAt.toString());
        result.put("additions", additions);
        result.put("deletions", deletions);
        result.put("files_changed", filesChanged);

        return result;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchCommitDetails(String url, String githubToken) {
        try {
            var builder = webClient.get().uri(url)
                    .header("Accept", "application/vnd.github.v3+json");

            if (githubToken != null && !githubToken.isEmpty()) {
                builder = builder.header("Authorization", "Bearer " + githubToken);
            }

            return builder.retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            return null;
        }
    }

    private LocalDateTime parseGithubTimestamp(String timestamp) {
        try {
            OffsetDateTime odt = OffsetDateTime.parse(timestamp, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
            return odt.toLocalDateTime();
        } catch (Exception e) {
            return LocalDateTime.now();
        }
    }
}
