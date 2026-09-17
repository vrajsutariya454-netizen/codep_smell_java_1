package com.codesmell.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RiskModelService {

    public Map<String, Object> trainModel(List<Map<String, Double>> features) {
        if (features == null || features.isEmpty()) {
            throw new IllegalArgumentException("No features to train on");
        }
        return Map.of("type", "heuristic_v3");
    }

    public Map<String, Object> predictRisk(Map<String, Object> model, Map<String, Double> features) {
        double totalChurn = features.getOrDefault("total_churn", 0.0);
        double filesChanged = features.getOrDefault("files_changed", 0.0);
        double messageLength = features.getOrDefault("message_length", 0.0);
        double isMergeCommit = features.getOrDefault("is_merge_commit", 0.0);

        double churnScore = Math.min(totalChurn / 1000.0, 1.0);
        double filesScore = Math.min(filesChanged / 50.0, 1.0);
        double messageScore = messageLength < 10 ? 0.3 : 0.0;

        double riskScore = churnScore * 0.5 + filesScore * 0.3 + messageScore * 0.2;

        if (isMergeCommit > 0) {
            riskScore *= 0.3;
        }

        riskScore = Math.max(0.0, Math.min(riskScore, 1.0));

        String label = riskScore > 0.6 ? "high" : "low";

        Map<String, Object> result = new HashMap<>();
        result.put("risk_score", riskScore);
        result.put("label", label);

        return result;
    }
}
