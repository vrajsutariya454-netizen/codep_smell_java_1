package com.codesmell.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommitResponse {
    private Long id;

    @JsonProperty("repository_id")
    private Long repositoryId;

    private String sha;

    private String message;

    private String author;

    private Integer additions;

    private Integer deletions;

    @JsonProperty("files_changed")
    private Integer filesChanged;

    @JsonProperty("committed_at")
    private LocalDateTime committedAt;

    private JsonNode features;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
