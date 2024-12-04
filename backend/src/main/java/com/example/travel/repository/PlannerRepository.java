package com.example.travel.repository;

import com.example.travel.entity.Planner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlannerRepository extends JpaRepository<Planner, Long>{
    List<Planner> findByChatId(String chatId);
}