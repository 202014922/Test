package com.example.travel.service;

import com.example.travel.entity.User;
import com.example.travel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * 특정 사용자 ID로 사용자 프로필을 가져오는 메서드
     * @param id 사용자 ID
     * @return 사용자 정보
     */
    public User getUserProfile(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    /**
     * 사용자 프로필 업데이트 메서드
     * @param updatedUser 업데이트된 사용자 정보
     * @return 업데이트된 사용자
     */
    public User updateUserProfile(User updatedUser) {
        User user = userRepository.findById(updatedUser.getId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.setTravelStyle(updatedUser.getTravelStyle());
        user.setPreferredDestination(updatedUser.getPreferredDestination());
        user.setHobbies(updatedUser.getHobbies()); // List<String>으로 설정
        user.setInterests(updatedUser.getInterests()); // List<String>으로 설정
        user.setBudget(updatedUser.getBudget()); // String으로 설정
        user.setAvailableTravelDates(updatedUser.getAvailableTravelDates());
        user.setBio(updatedUser.getBio()); // 자기소개 업데이트

        // 프로필 사진 업데이트
        if (updatedUser.getProfilePicture() != null && !updatedUser.getProfilePicture().isEmpty()) {
            user.setProfilePicture(updatedUser.getProfilePicture());
        }

        return userRepository.save(user);
    }

    /**
     * 프로필 사진을 업데이트하는 메서드
     * @param userId 사용자 ID
     * @param fileUrl 이미지 URL
     * @return 업데이트된 사용자
     */
    public User updateProfilePicture(Long userId, String fileUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.setProfilePicture(fileUrl);
        return userRepository.save(user);
    }

    /**
     * 사용자의 여행 가능 날짜를 추가하는 메서드
     * @param userId 사용자 ID
     * @param date 여행 가능 날짜
     * @return 업데이트된 사용자 정보
     */
    public User addAvailableTravelDate(Long userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        List<LocalDate> dates = user.getAvailableTravelDates();
        dates.add(date);
        user.setAvailableTravelDates(dates);
        return userRepository.save(user);
    }
}