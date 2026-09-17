package com.codesmell.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String authHeader = request.getHeader("Authorization");
        int statusCode;
        String message;

        if (authHeader == null || authHeader.isEmpty()) {
            statusCode = HttpServletResponse.SC_FORBIDDEN;
            message = "Missing authorization header";
        } else {
            statusCode = HttpServletResponse.SC_UNAUTHORIZED;
            message = "Invalid or expired token";
        }

        response.setStatus(statusCode);

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("detail", message);

        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
