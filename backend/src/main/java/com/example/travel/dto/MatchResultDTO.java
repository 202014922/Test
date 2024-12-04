package com.example.travel.dto;

import com.example.travel.entity.User;

public class MatchResultDTO {
    private User user;
    private double similarityScore;
    private Long matchId; // 매칭 ID

    // 생성자
    public MatchResultDTO(User user, double similarityScore, Long matchId) {
        this.user = user;
        this.similarityScore = similarityScore;
        this.matchId = matchId;
    }

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getSimilarityScore() {
        return similarityScore;
    }

    public void setSimilarityScore(double similarityScore) {
        this.similarityScore = similarityScore;
    }

    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(Long matchId) {
        this.matchId = matchId;
    }
}