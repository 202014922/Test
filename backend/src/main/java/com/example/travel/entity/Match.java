package com.example.travel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long user1Id;
    private Long user2Id;

    @Enumerated(EnumType.STRING)
    private MatchStatus status; // 매칭 상태: 대기, 수락, 거절

    // 기본 생성자
    public Match() {}

    // 매칭 생성 시 필요한 생성자
    public Match(Long user1Id, Long user2Id, MatchStatus status) {
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUser1Id() {
        return user1Id;
    }

    public void setUser1Id(Long user1Id) {
        this.user1Id = user1Id;
    }

    public Long getUser2Id() {
        return user2Id;
    }

    public void setUser2Id(Long user2Id) {
        this.user2Id = user2Id;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }
}