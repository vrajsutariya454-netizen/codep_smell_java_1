package com.codesmell.controller;

import com.codesmell.entity.User;
import com.codesmell.repository.UserRepository;
import com.codesmell.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void testHealthCheck() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
    }

    @Test
    void testGithubLoginRedirect() throws Exception {
        mockMvc.perform(get("/auth/github/login"))
                .andExpect(status().is3xxRedirection())
                .andExpect(header().string("Location", containsString("github.com/login/oauth/authorize")))
                .andExpect(header().string("Location", containsString("client_id=")));
    }

    @Test
    void testAnalyzeWithoutAuth() throws Exception {
        mockMvc.perform(post("/analyze")
                .contentType("application/json")
                .content("{\"repo_url\": \"https://github.com/test/repo\", \"max_commits\": 10}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.detail").exists());
    }

    @Test
    void testAnalyzeWithInvalidUrl() throws Exception {
        User user = new User();
        user.setGithubId("123");
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setGithubToken("token123");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtService.generateToken("123");

        mockMvc.perform(post("/analyze")
                .header("Authorization", "Bearer " + token)
                .contentType("application/json")
                .content("{\"repo_url\": \"https://invalid.com/user/repo\", \"max_commits\": 10}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").exists());
    }

    @Test
    void testAnalyzeWithInvalidToken() throws Exception {
        mockMvc.perform(post("/analyze")
                .header("Authorization", "Bearer invalid.token.here")
                .contentType("application/json")
                .content("{\"repo_url\": \"https://github.com/test/repo\", \"max_commits\": 10}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.detail").exists());
    }
}
