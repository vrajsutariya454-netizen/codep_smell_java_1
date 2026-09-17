package com.codesmell.repository;

import com.codesmell.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    @Query("SELECT p FROM Prediction p JOIN p.commit c WHERE c.repository.id = :repositoryId")
    List<Prediction> findByRepository(@Param("repositoryId") Long repositoryId);
}
