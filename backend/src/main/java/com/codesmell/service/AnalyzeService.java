package com.codesmell.service;

import com.codesmell.dto.AnalyzeRequest;
import com.codesmell.dto.AnalyzeResponse;
import com.codesmell.dto.CommitResponse;
import com.codesmell.dto.PredictionResponse;
import com.codesmell.entity.Commit;
import com.codesmell.entity.Prediction;
import com.codesmell.entity.Repository;
import com.codesmell.entity.User;
import com.codesmell.repository.CommitRepository;
import com.codesmell.repository.GitRepositoryRepository;
import com.codesmell.repository.PredictionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AnalyzeService {

    private final GitHubMiningService miningService;
    private final FeatureExtractionService featureExtractionService;
    private final RiskModelService riskModelService;
    private final GitRepositoryRepository repositoryRepository;
    private final CommitRepository commitRepository;
    private final PredictionRepository predictionRepository;
    private final ObjectMapper objectMapper;

    public AnalyzeService(GitHubMiningService miningService,
                          FeatureExtractionService featureExtractionService,
                          RiskModelService riskModelService,
                          GitRepositoryRepository repositoryRepository,
                          CommitRepository commitRepository,
                          PredictionRepository predictionRepository,
                          ObjectMapper objectMapper) {
        this.miningService = miningService;
        this.featureExtractionService = featureExtractionService;
        this.riskModelService = riskModelService;
        this.repositoryRepository = repositoryRepository;
        this.commitRepository = commitRepository;
        this.predictionRepository = predictionRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public AnalyzeResponse analyze(AnalyzeRequest request, User currentUser) {
        String repoUrl = request.getRepoUrl();
        Integer maxCommits = request.getMaxCommits() != null ? request.getMaxCommits() : 100;

        // Find or create repository
        Repository repository = repositoryRepository.findByUrl(repoUrl)
                .orElseGet(() -> {
                    String[] parts = miningService.parseGithubUrl(repoUrl);
                    if (parts == null) {
                        throw new IllegalArgumentException("Invalid GitHub URL format");
                    }
                    String owner = parts[0];
                    String name = parts[1];

                    Repository newRepo = new Repository();
                    newRepo.setOwner(currentUser);
                    newRepo.setUrl(repoUrl);
                    newRepo.setOwnerName(owner);
                    newRepo.setName(name);
                    newRepo.setCreatedAt(LocalDateTime.now());
                    newRepo.setUpdatedAt(LocalDateTime.now());
                    return repositoryRepository.save(newRepo);
                });

        // Mine commits
        List<Map<String, Object>> commitData;
        try {
            commitData = miningService.mineCommits(repoUrl, maxCommits, currentUser.getGithubToken());
        } catch (Exception e) {
            throw new IllegalArgumentException(e.getMessage());
        }

        if (commitData == null || commitData.isEmpty()) {
            throw new IllegalArgumentException("No commits found in repository");
        }

        // Extract features and identify new commits
        List<Map<String, Double>> featureDicts = new ArrayList<>();
        List<CommitAndFeatures> commitsToProcess = new ArrayList<>();

        for (Map<String, Object> rawCommit : commitData) {
            String sha = (String) rawCommit.get("sha");
            Optional<Commit> existing = commitRepository.findByRepositoryIdAndSha(repository.getId(), sha);

            if (existing.isEmpty()) {
                Map<String, Double> features = featureExtractionService.extractFeatures(rawCommit);
                featureDicts.add(features);
                commitsToProcess.add(new CommitAndFeatures(rawCommit, features));
            }
        }

        // If no new commits, return existing predictions
        if (commitsToProcess.isEmpty()) {
            List<Prediction> existingPredictions = predictionRepository.findByRepository(repository.getId());
            List<PredictionResponse> predictions = existingPredictions.stream()
                    .map(this::toPredictionResponse)
                    .toList();
            return new AnalyzeResponse(repository.getId(), predictions.size(), predictions);
        }

        // Train model
        Map<String, Object> model;
        try {
            model = riskModelService.trainModel(featureDicts);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e.getMessage());
        }

        // Predict and persist
        List<Prediction> predictions = new ArrayList<>();
        for (CommitAndFeatures commitAndFeatures : commitsToProcess) {
            Map<String, Object> rawCommit = commitAndFeatures.rawCommit;
            Map<String, Double> features = commitAndFeatures.features;

            Map<String, Object> prediction = riskModelService.predictRisk(model, features);
            double riskScore = ((Number) prediction.get("risk_score")).doubleValue();
            String label = (String) prediction.get("label");

            String committedAtStr = (String) rawCommit.get("committed_at");
            LocalDateTime committedAt = LocalDateTime.parse(committedAtStr);

            Commit commit = new Commit();
            commit.setRepository(repository);
            commit.setSha((String) rawCommit.get("sha"));
            commit.setMessage((String) rawCommit.get("message"));
            commit.setAuthor((String) rawCommit.get("author"));
            commit.setAdditions(((Number) rawCommit.get("additions")).intValue());
            commit.setDeletions(((Number) rawCommit.get("deletions")).intValue());
            commit.setFilesChanged(((Number) rawCommit.get("files_changed")).intValue());
            commit.setCommittedAt(committedAt);
            commit.setFeatures(objectMapper.valueToTree(features));
            commit.setCreatedAt(LocalDateTime.now());
            commit = commitRepository.save(commit);

            Prediction pred = new Prediction();
            pred.setCommit(commit);
            pred.setRiskScore(riskScore);
            pred.setLabel(label);
            pred.setModelUsed("heuristic_v3");
            pred.setCreatedAt(LocalDateTime.now());
            pred = predictionRepository.save(pred);

            predictions.add(pred);
        }

        List<PredictionResponse> predictionResponses = predictions.stream()
                .map(this::toPredictionResponse)
                .toList();

        return new AnalyzeResponse(repository.getId(), commitsToProcess.size(), predictionResponses);
    }

    private PredictionResponse toPredictionResponse(Prediction prediction) {
        return new PredictionResponse(
                prediction.getId(),
                prediction.getCommit().getId(),
                prediction.getRiskScore(),
                prediction.getLabel(),
                prediction.getModelUsed(),
                prediction.getCreatedAt()
        );
    }

    private static class CommitAndFeatures {
        Map<String, Object> rawCommit;
        Map<String, Double> features;

        CommitAndFeatures(Map<String, Object> rawCommit, Map<String, Double> features) {
            this.rawCommit = rawCommit;
            this.features = features;
        }
    }
}
