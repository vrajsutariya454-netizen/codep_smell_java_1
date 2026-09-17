package com.codesmell.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeResponse {
    @JsonProperty("repository_id")
    private Long repositoryId;

    @JsonProperty("total_commits")
    private Integer totalCommits;

    private List<PredictionResponse> predictions;
}
