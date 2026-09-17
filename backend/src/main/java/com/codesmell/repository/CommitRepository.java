package com.codesmell.repository;

import com.codesmell.entity.Commit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommitRepository extends JpaRepository<Commit, Long> {
    Optional<Commit> findByRepositoryIdAndSha(Long repositoryId, String sha);
}
