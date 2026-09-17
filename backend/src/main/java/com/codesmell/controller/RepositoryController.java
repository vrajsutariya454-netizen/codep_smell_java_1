package com.codesmell.controller;

import com.codesmell.dto.RepositoryResponse;
import com.codesmell.entity.User;
import com.codesmell.repository.GitRepositoryRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/repositories")
public class RepositoryController {

    private final GitRepositoryRepository repositoryRepository;

    public RepositoryController(GitRepositoryRepository repositoryRepository) {
        this.repositoryRepository = repositoryRepository;
    }

    @GetMapping
    public List<RepositoryResponse> listRepositories(@AuthenticationPrincipal User currentUser) {
        return repositoryRepository.findByOwnerId(currentUser.getId()).stream()
                .map(repo -> new RepositoryResponse(
                        repo.getId(),
                        repo.getOwner().getId(),
                        repo.getUrl(),
                        repo.getOwnerName(),
                        repo.getName(),
                        repo.getCreatedAt()
                ))
                .toList();
    }
}
