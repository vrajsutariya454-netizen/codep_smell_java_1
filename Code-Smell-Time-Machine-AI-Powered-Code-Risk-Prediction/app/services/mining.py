import httpx
import re
from datetime import datetime


def parse_github_url(url: str) -> tuple[str, str] | None:
    match = re.match(r"https://github\.com/([^/]+)/([^/]+)(?:\.git)?/?$", str(url))
    if match:
        return match.group(1), match.group(2)
    return None


async def mine_commits(
    repo_url: str,
    max_commits: int = 100,
    github_token: str | None = None,
) -> list[dict]:
    parsed = parse_github_url(repo_url)
    if not parsed:
        raise ValueError(f"Invalid GitHub URL: {repo_url}")

    owner, repo = parsed
    commits = []
    page = 1
    per_page = 30

    headers = {"Accept": "application/vnd.github.v3+json"}
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"

    async with httpx.AsyncClient() as client:
        while len(commits) < max_commits:
            url = f"https://api.github.com/repos/{owner}/{repo}/commits"
            params = {"per_page": per_page, "page": page}

            response = await client.get(url, params=params, headers=headers)
            if response.status_code != 200:
                raise ValueError(
                    f"Failed to fetch commits from GitHub: {response.status_code}"
                )

            batch = response.json()
            if not batch:
                break

            for commit_data in batch:
                if len(commits) >= max_commits:
                    break

                sha = commit_data["sha"]
                commit_detail = await client.get(
                    commit_data["url"], headers=headers
                )
                if commit_detail.status_code != 200:
                    continue

                detail = commit_detail.json()
                commits.append(
                    {
                        "sha": sha,
                        "message": commit_data.get("commit", {}).get("message", ""),
                        "author": commit_data.get("commit", {})
                        .get("author", {})
                        .get("name", ""),
                        "committed_at": commit_data.get("commit", {})
                        .get("author", {})
                        .get("date", datetime.utcnow().isoformat()),
                        "additions": detail.get("stats", {}).get("additions", 0),
                        "deletions": detail.get("stats", {}).get("deletions", 0),
                        "files_changed": len(detail.get("files", [])),
                    }
                )

            page += 1

    return commits
