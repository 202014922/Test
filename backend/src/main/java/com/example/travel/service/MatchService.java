package com.example.travel.service;

import com.example.travel.dto.MatchResultDTO;
import com.example.travel.entity.Match;
import com.example.travel.entity.MatchStatus;
import com.example.travel.entity.User;
import com.example.travel.repository.MatchRepository;
import com.example.travel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatService chatService; // ChatService 주입

    /**
     * 모든 매칭을 가져옵니다.
     */
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    /**
     * 새로운 매칭을 생성합니다.
     */
    public Match createMatch(Match match) {
        match.setStatus(MatchStatus.대기); // 매칭 생성 시 상태를 '대기'로 설정
        return matchRepository.save(match);
    }

    /**
     * 매칭 상태를 업데이트합니다.
     */
    public Match updateMatchStatus(Long matchId, MatchStatus status) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("매칭을 찾을 수 없습니다."));
        match.setStatus(status);
        return matchRepository.save(match);
    }

    /**
     * 매칭을 수락하는 메서드
     *
     * @param matchId 매칭 ID
     * @return 업데이트된 매칭 정보
     */
    public Match acceptMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("매칭을 찾을 수 없습니다."));
        if (match.getStatus() != MatchStatus.대기) {
            throw new RuntimeException("이미 처리된 매칭입니다.");
        }
        match.setStatus(MatchStatus.수락);
        matchRepository.save(match);

        // 채팅 방 생성 및 할당
        String chatId = createChatRoomForMatch(match);
        chatService.createChatRoom(chatId, match.getUser1Id(), match.getUser2Id());

        return match;
    }

    /**
     * 매칭을 거절하는 메서드
     *
     * @param matchId 매칭 ID
     * @return 업데이트된 매칭 정보
     */
    public Match rejectMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("매칭을 찾을 수 없습니다."));
        if (match.getStatus() != MatchStatus.대기) {
            throw new RuntimeException("이미 처리된 매칭입니다.");
        }
        match.setStatus(MatchStatus.거절);
        return matchRepository.save(match);
    }

    /**
     * 사용자 프로필에 기반하여 매칭을 수행하는 메서드
     * 1. 여행 가능 날짜가 겹치는 사용자 필터링 (필수)
     * 2. 예산이 일치하는 사용자 필터링 (필수)
     * 3. 여행 성향, 선호하는 여행지, 취미, 관심사 유사성 계산 및 정렬
     *
     * @param userId 매칭을 요청한 사용자 ID
     * @return 매칭된 사용자 리스트
     */
    public List<MatchResultDTO> findMatches(Long userId) {
        User requestingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        List<User> allUsers = userRepository.findAll();

        // 필수 조건: 동일한 예산 및 여행 가능 날짜가 겹치는 사용자 필터링
        List<User> filteredUsers = allUsers.stream()
                .filter(user -> !user.getId().equals(userId))
                .filter(user -> user.getBudget() != null && user.getBudget().equalsIgnoreCase(requestingUser.getBudget()))
                .filter(user -> hasOverlappingDates(requestingUser.getAvailableTravelDates(), user.getAvailableTravelDates()))
                .collect(Collectors.toList());

        // 유사성 계산 및 DTO 생성
        return filteredUsers.stream()
                .map(u -> new MatchResultDTO(u, calculateSimilarity(requestingUser, u), null)) // matchId는 null로 초기화
                .sorted((dto1, dto2) -> Double.compare(dto2.getSimilarityScore(), dto1.getSimilarityScore()))
                .collect(Collectors.toList());
    }

    /**
     * 특정 사용자에게 도착한 매칭 요청(알림)을 가져오는 메서드
     *
     * @param userId 대상 사용자 ID
     * @return 매칭 요청 리스트
     */
    public List<MatchResultDTO> getNotifications(Long userId) {
        List<Match> pendingMatches = matchRepository.findByUser2IdAndStatus(userId, MatchStatus.대기);
        return pendingMatches.stream()
                .map(match -> {
                    User requester = userRepository.findById(match.getUser1Id())
                            .orElseThrow(() -> new RuntimeException("요청자 사용자를 찾을 수 없습니다."));
                    double similarity = calculateSimilarity(requester, userRepository.findById(userId).orElse(null));
                    return new MatchResultDTO(requester, similarity, match.getId());
                })
                .collect(Collectors.toList());
    }

    /**
     * 두 사용자의 여행 가능 날짜가 겹치는지 확인합니다.
     * 최소 하나의 날짜가 겹쳐야 합니다.
     *
     * @param dates1 사용자1의 여행 가능 날짜 리스트
     * @param dates2 사용자2의 여행 가능 날짜 리스트
     * @return 겹치는 날짜가 있으면 true, 아니면 false
     */
    private boolean hasOverlappingDates(List<LocalDate> dates1, List<LocalDate> dates2) {
        if (dates1 == null || dates2 == null) return false;
        for (LocalDate date : dates1) {
            if (dates2.contains(date)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 두 사용자의 프로필 유사성을 계산합니다.
     * 여행 성향, 선호하는 여행지, 취미, 관심사의 일치 정도를 퍼센티지로 반환합니다.
     *
     * @param user1 기준 사용자
     * @param user2 매칭 대상 사용자
     * @return 유사성 퍼센티지 (0 ~ 100)
     */
    private double calculateSimilarity(User user1, User user2) {
        double travelStyleScore = similarityScore(user1.getTravelStyle(), user2.getTravelStyle());
        double destinationScore = similarityScore(user1.getPreferredDestination(), user2.getPreferredDestination());
        double hobbiesScore = listSimilarityScore(user1.getHobbies(), user2.getHobbies());
        double interestsScore = listSimilarityScore(user1.getInterests(), user2.getInterests());

        // 각 항목의 가중치를 설정할 수 있습니다. 여기서는 동일 가중치로 설정
        double totalScore = travelStyleScore + destinationScore + hobbiesScore + interestsScore;
        return totalScore / 4.0; // 평균 유사성
    }

    /**
     * 두 문자열의 일치 여부를 기반으로 점수를 반환합니다.
     *
     * @param s1 첫 번째 문자열
     * @param s2 두 번째 문자열
     * @return 일치 시 100, 불일치 시 0
     */
    private double similarityScore(String s1, String s2) {
        if (s1 == null || s2 == null) return 0;
        return s1.equalsIgnoreCase(s2) ? 100.0 : 0.0;
    }

    /**
     * 두 리스트의 유사성을 퍼센티지로 계산합니다.
     * 유사성은 공통 요소의 비율로 계산됩니다.
     *
     * @param list1 첫 번째 리스트
     * @param list2 두 번째 리스트
     * @return 유사성 퍼센티지 (0 ~ 100)
     */
    private double listSimilarityScore(List<String> list1, List<String> list2) {
        if (list1 == null || list2 == null || list1.isEmpty() || list2.isEmpty()) return 0.0;

        Set<String> set1 = list1.stream().map(String::toLowerCase).collect(Collectors.toSet());
        Set<String> set2 = list2.stream().map(String::toLowerCase).collect(Collectors.toSet());

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        if (set1.isEmpty() && set2.isEmpty()) return 100.0;
        if (set1.isEmpty() || set2.isEmpty()) return 0.0;

        double similarity = ((double) intersection.size()) / Math.min(set1.size(), set2.size()) * 100.0;
        return similarity;
    }

    /**
     * 매칭 수락 시 채팅 방을 생성하는 메서드
     *
     * @param match 업데이트된 매칭 정보
     * @return 생성된 채팅 방 ID
     */
    /**
     * 매칭 수락 시 채팅 방을 생성하는 메서드
     *
     * @param match 업데이트된 매칭 정보
     * @return 생성된 채팅 방 ID
     */
    private String createChatRoomForMatch(Match match) {
        Long user1Id = match.getUser1Id();
        Long user2Id = match.getUser2Id();

        // 채팅 ID는 두 사용자 ID를 오름차순으로 정렬하여 생성
        Long smallerId = Math.min(user1Id, user2Id);
        Long largerId = Math.max(user1Id, user2Id);
        String chatId = "chat_" + smallerId + "_" + largerId;

        // 채팅 방 생성
        chatService.createChatRoom(chatId, smallerId, largerId);

        return chatId;
    }
}