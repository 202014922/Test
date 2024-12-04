package com.example.travel.repository;

import com.example.travel.entity.Match;
import com.example.travel.entity.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByUser2IdAndStatus(Long user2Id, MatchStatus status);
}