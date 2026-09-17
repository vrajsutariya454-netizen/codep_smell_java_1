package com.codesmell.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeRequest {
    @NotBlank(message = "Repository URL is required")
    @JsonProperty("repo_url")
    private String repoUrl;

    @JsonProperty("max_commits")
    private Integer maxCommits = 100;
}
