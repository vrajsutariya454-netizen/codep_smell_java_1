package com.codesmell.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.algorithm}")
    private String jwtAlgorithm;

    @Value("${jwt.expire-minutes}")
    private Long jwtExpireMinutes;

    public String generateToken(String githubId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("github_id", githubId);

        long expirationTime = System.currentTimeMillis() + (jwtExpireMinutes * 60 * 1000);
        return Jwts.builder()
                .subject(githubId)
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(expirationTime))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .compact();
    }

    public String extractGithubId(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return (String) claims.get("github_id");
        } catch (JwtException e) {
            return null;
        }
    }

    public boolean isTokenValid(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
