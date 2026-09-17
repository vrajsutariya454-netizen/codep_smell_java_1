package com.codesmell.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryResponse {
    private Long id;

    @JsonProperty("owner_id")
    private Long ownerId;

    private String url;

    @JsonProperty("owner")
    private String ownerName;

    private String name;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
