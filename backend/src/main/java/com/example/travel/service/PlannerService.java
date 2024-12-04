package com.example.travel.service;

import com.example.travel.entity.Planner;
import com.example.travel.repository.PlannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PlannerService {

    @Autowired
    private PlannerRepository plannerRepository;

    public Planner createPlanner(Planner planner) {
        return plannerRepository.save(planner);
    }

    public List<Planner> getPlanners(String chatId) {
        return plannerRepository.findByChatId(chatId);
    }

    public Planner updatePlanner(Planner updatedPlanner) {
        Planner planner = plannerRepository.findById(updatedPlanner.getId())
                .orElseThrow(() -> new RuntimeException("플래너를 찾을 수 없습니다."));
        planner.setSchedule(updatedPlanner.getSchedule());
        planner.setBudget(updatedPlanner.getBudget());
        planner.setLocation(updatedPlanner.getLocation());
        planner.setTime(updatedPlanner.getTime());
        return plannerRepository.save(planner);
    }

    /**
     * 플래너를 삭제합니다.
     *
     * @param plannerId 플래너 ID
     */
    @Transactional
    public void deletePlanner(Long plannerId) {
        Optional<Planner> plannerOpt = plannerRepository.findById(plannerId);
        if (!plannerOpt.isPresent()) {
            throw new RuntimeException("플래너가 존재하지 않습니다. ID: " + plannerId);
        }
        plannerRepository.deleteById(plannerId);
    }
}