package com.example.travel.controller;

import com.example.travel.dto.MatchResultDTO;
import com.example.travel.entity.Match;
import com.example.travel.entity.MatchStatus;
import com.example.travel.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/match")
@CrossOrigin(origins = "http://localhost:3000")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @GetMapping("/all")
    public List<Match> getAllMatches() {
        return matchService.getAllMatches();
    }

    @PostMapping("/create")
    public Match createMatch(@RequestBody Match match) {
        return matchService.createMatch(match);
    }

    @PutMapping("/update-status/{id}")
    public Match updateMatchStatus(@PathVariable Long id, @RequestParam MatchStatus status) {
        return matchService.updateMatchStatus(id, status);
    }

    /**
     * 매칭을 요청한 사용자에 기반하여 매칭된 사용자 리스트와 유사성 점수를 반환하는 엔드포인트
     */
    @GetMapping("/find-matches/{userId}")
    public List<MatchResultDTO> findMatches(@PathVariable Long userId) {
        return matchService.findMatches(userId);
    }

    /**
     * 특정 사용자에게 도착한 매칭 요청(알림)을 가져오는 엔드포인트
     *
     * @param userId 대상 사용자 ID
     * @return 매칭 요청 리스트
     */
    @GetMapping("/notifications/{userId}")
    public List<MatchResultDTO> getNotifications(@PathVariable Long userId) {
        return matchService.getNotifications(userId);
    }

    /**
     * 매칭 요청을 수락하는 엔드포인트
     *
     * @param matchId 매칭 ID
     * @return 업데이트된 매칭 정보
     */
    @PostMapping("/notifications/accept/{matchId}")
    public Match acceptMatch(@PathVariable Long matchId) {
        return matchService.acceptMatch(matchId);
    }

    /**
     * 매칭 요청을 거절하는 엔드포인트
     *
     * @param matchId 매칭 ID
     * @return 업데이트된 매칭 정보
     */
    @PostMapping("/notifications/reject/{matchId}")
    public Match rejectMatch(@PathVariable Long matchId) {
        return matchService.rejectMatch(matchId);
    }
}