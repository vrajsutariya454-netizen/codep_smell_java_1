package com.codesmell.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponse {
    private Long id;

    @JsonProperty("commit_id")
    private Long commitId;

    @JsonProperty("risk_score")
    private Double riskScore;

    private String label;

    @JsonProperty("model_used")
    private String modelUsed;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
