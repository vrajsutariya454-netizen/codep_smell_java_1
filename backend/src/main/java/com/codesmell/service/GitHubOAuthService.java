package com.codesmell.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GitHubOAuthService {

    @Value("${spring.security.oauth2.client.registration.github.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.github.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.provider.github.token-uri}")
    private String tokenUri;

    @Value("${spring.security.oauth2.client.provider.github.user-info-uri}")
    private String userInfoUri;

    private final WebClient webClient;

    public GitHubOAuthService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String exchangeCodeForToken(String code, String redirectUri) {
        try {
            var response = webClient.post()
                    .uri(tokenUri)
                    .header("Accept", "application/json")
                    .bodyValue(Map.of(
                            "client_id", clientId,
                            "client_secret", clientSecret,
                            "code", code,
                            "redirect_uri", redirectUri
                    ))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null) {
                return (String) response.get("access_token");
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    public Map<String, Object> fetchGithubUser(String accessToken) {
        try {
            return webClient.get()
                    .uri(userInfoUri)
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/vnd.github.v3+json")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            return null;
        }
    }
}
