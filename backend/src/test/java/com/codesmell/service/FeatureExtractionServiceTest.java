package com.codesmell.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FeatureExtractionServiceTest {

    private FeatureExtractionService service;

    @BeforeEach
    void setUp() {
        service = new FeatureExtractionService();
    }

    @Test
    void testNormalCommit() {
        Map<String, Object> commit = new HashMap<>();
        commit.put("additions", 10);
        commit.put("deletions", 5);
        commit.put("files_changed", 2);
        commit.put("message", "Fix bug in parser");

        Map<String, Double> features = service.extractFeatures(commit);

        assertEquals(10.0, features.get("additions"));
        assertEquals(5.0, features.get("deletions"));
        assertEquals(15.0, features.get("total_churn"));
        assertEquals(7.5, features.get("avg_churn_per_file"));
        assertEquals(2.0, features.get("files_changed"));
        assertEquals(17.0, features.get("message_length"));
        assertEquals(0.0, features.get("is_merge_commit"));
    }

    @Test
    void testMergeCommit() {
        Map<String, Object> commit = new HashMap<>();
        commit.put("additions", 50);
        commit.put("deletions", 30);
        commit.put("files_changed", 5);
        commit.put("message", "Merge pull request #123 from feature/branch");

        Map<String, Double> features = service.extractFeatures(commit);

        assertEquals(1.0, features.get("is_merge_commit"));
        assertEquals(80.0, features.get("total_churn"));
        assertEquals(16.0, features.get("avg_churn_per_file"));
    }

    @Test
    void testZeroFilesChanged() {
        Map<String, Object> commit = new HashMap<>();
        commit.put("additions", 0);
        commit.put("deletions", 0);
        commit.put("files_changed", 0);
        commit.put("message", "");

        Map<String, Double> features = service.extractFeatures(commit);

        assertEquals(0.0, features.get("total_churn"));
        assertEquals(0.0, features.get("avg_churn_per_file"));
        assertEquals(0.0, features.get("message_length"));
    }

    @Test
    void testEmptyMessage() {
        Map<String, Object> commit = new HashMap<>();
        commit.put("additions", 5);
        commit.put("deletions", 3);
        commit.put("files_changed", 1);
        commit.put("message", "");

        Map<String, Double> features = service.extractFeatures(commit);

        assertEquals(0.0, features.get("message_length"));
    }

    @Test
    void testLargeChurn() {
        Map<String, Object> commit = new HashMap<>();
        commit.put("additions", 400);
        commit.put("deletions", 400);
        commit.put("files_changed", 50);
        commit.put("message", "Large refactoring");

        Map<String, Double> features = service.extractFeatures(commit);

        assertEquals(800.0, features.get("total_churn"));
        assertEquals(16.0, features.get("avg_churn_per_file"));
    }
}
