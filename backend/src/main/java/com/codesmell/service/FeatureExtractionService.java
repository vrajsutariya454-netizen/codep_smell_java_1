package com.codesmell.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FeatureExtractionService {

    public Map<String, Double> extractFeatures(Map<String, Object> commit) {
        int additions = ((Number) commit.getOrDefault("additions", 0)).intValue();
        int deletions = ((Number) commit.getOrDefault("deletions", 0)).intValue();
        int filesChanged = ((Number) commit.getOrDefault("files_changed", 0)).intValue();
        String message = (String) commit.getOrDefault("message", "");

        double totalChurn = additions + deletions;
        double avgChurnPerFile = filesChanged > 0 ? totalChurn / filesChanged : totalChurn;
        double messageLength = message.length();
        double isMergeCommit = message.toLowerCase().startsWith("merge") ? 1.0 : 0.0;

        Map<String, Double> features = new HashMap<>();
        features.put("additions", (double) additions);
        features.put("deletions", (double) deletions);
        features.put("total_churn", totalChurn);
        features.put("files_changed", (double) filesChanged);
        features.put("message_length", messageLength);
        features.put("is_merge_commit", isMergeCommit);
        features.put("avg_churn_per_file", avgChurnPerFile);

        return features;
    }
}
