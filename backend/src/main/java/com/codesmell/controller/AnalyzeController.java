package com.codesmell.controller;

import com.codesmell.dto.AnalyzeRequest;
import com.codesmell.dto.AnalyzeResponse;
import com.codesmell.entity.User;
import com.codesmell.service.AnalyzeService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnalyzeController {

    private final AnalyzeService analyzeService;

    public AnalyzeController(AnalyzeService analyzeService) {
        this.analyzeService = analyzeService;
    }

    @PostMapping("/analyze")
    public AnalyzeResponse analyze(@Valid @RequestBody AnalyzeRequest request,
                                   @AuthenticationPrincipal User currentUser) {
        return analyzeService.analyze(request, currentUser);
    }
}
