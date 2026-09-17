package com.codesmell.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;

    @JsonProperty("github_id")
    private String githubId;

    private String username;

    private String email;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
