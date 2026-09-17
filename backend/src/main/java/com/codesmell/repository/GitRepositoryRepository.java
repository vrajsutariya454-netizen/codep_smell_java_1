package com.codesmell.repository;

import com.codesmell.entity.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GitRepositoryRepository extends JpaRepository<Repository, Long> {
    Optional<Repository> findByUrl(String url);

    List<Repository> findByOwnerId(Long ownerId);
}
