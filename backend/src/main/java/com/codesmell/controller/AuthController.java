package com.codesmell.controller;

import com.codesmell.entity.User;
import com.codesmell.repository.UserRepository;
import com.codesmell.security.JwtService;
import com.codesmell.service.GitHubOAuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final GitHubOAuthService oauthService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${spring.security.oauth2.client.registration.github.client-id}")
    private String githubClientId;

    @Value("${spring.security.oauth2.client.registration.github.redirect-uri}")
    private String githubRedirectUri;

    @Value("${debug:false}")
    private boolean debugMode;

    public AuthController(GitHubOAuthService oauthService, JwtService jwtService, UserRepository userRepository) {
        this.oauthService = oauthService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @GetMapping("/test/login")
    public RedirectView testLogin() {
        String githubId = "test-user-123";
        Optional<User> existing = userRepository.findByGithubId(githubId);

        User user = existing.orElse(new User());
        user.setGithubId(githubId);
        user.setUsername("test-user");
        user.setEmail("test@example.com");
        user.setGithubToken(null);

        if (existing.isEmpty()) {
            user.setCreatedAt(LocalDateTime.now());
        }
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(githubId);
        return new RedirectView("http://localhost:5173/auth/callback?token=" + jwtToken);
    }

    @GetMapping("/github/login")
    public RedirectView githubLogin() {
        String authUrl = "https://github.com/login/oauth/authorize?" +
                "client_id=" + githubClientId +
                "&redirect_uri=" + githubRedirectUri +
                "&scope=user:email,repo";
        return new RedirectView(authUrl);
    }

    @GetMapping("/github/callback")
    public RedirectView githubCallback(@RequestParam(required = false) String code,
                                       @RequestParam(required = false) String error) {
        if (error != null || code == null) {
            return new RedirectView("http://localhost:5173/auth/error");
        }

        String accessToken = oauthService.exchangeCodeForToken(code, githubRedirectUri);
        if (accessToken == null) {
            return new RedirectView("http://localhost:5173/auth/error");
        }

        Map<String, Object> githubUser = oauthService.fetchGithubUser(accessToken);
        if (githubUser == null) {
            return new RedirectView("http://localhost:5173/auth/error");
        }

        String githubId = String.valueOf(githubUser.get("id"));
        String username = (String) githubUser.get("login");
        String email = (String) githubUser.get("email");

        Optional<User> existingUser = userRepository.findByGithubId(githubId);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setUsername(username);
            user.setEmail(email);
            user.setGithubToken(accessToken);
            user.setUpdatedAt(LocalDateTime.now());
        } else {
            user = new User();
            user.setGithubId(githubId);
            user.setUsername(username);
            user.setEmail(email);
            user.setGithubToken(accessToken);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
        }

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(githubId);
        return new RedirectView("http://localhost:5173/auth/callback?token=" + jwtToken);
    }
}
