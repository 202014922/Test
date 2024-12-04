package com.example.travel.controller;

import com.example.travel.entity.Planner;
import com.example.travel.service.PlannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/planner")
@CrossOrigin(origins = "http://localhost:3000")
public class PlannerController {

    @Autowired
    private PlannerService plannerService;

    @PostMapping("/create")
    public Planner createPlanner(@RequestBody Planner planner) {
        return plannerService.createPlanner(planner);
    }

    @GetMapping("/chat/{chatId}")
    public List<Planner> getPlanners(@PathVariable String chatId) {
        return plannerService.getPlanners(chatId);
    }

    @PutMapping("/update")
    public Planner updatePlanner(@RequestBody Planner planner) {
        return plannerService.updatePlanner(planner);
    }

    /**
     * 플래너를 삭제합니다.
     *
     * @param plannerId 플래너 ID
     * @return 성공 또는 실패 메시지
     */
    @DeleteMapping("/delete/{plannerId}")
    public ResponseEntity<?> deletePlanner(@PathVariable Long plannerId) {
        try {
            plannerService.deletePlanner(plannerId);
            return ResponseEntity.ok().body("플래너가 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("플래너 삭제에 실패했습니다.");
        }
    }
}