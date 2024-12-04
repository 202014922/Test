// AuthController.java
package com.example.travel.controller;

import com.example.travel.entity.User;
import com.example.travel.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

/**
 * AuthController는 사용자 인증 관련 엔드포인트를 제공합니다.
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * 사용자 회원가입 엔드포인트
     * @param users 사용자 정보
     * @return 등록된 사용자
     */
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User users) {
        User registeredUser = authService.register(users);
        return ResponseEntity.ok(registeredUser);
    }

    /**
     * 사용자 로그인 엔드포인트
     * @param loginRequest 사용자 로그인 정보 (username, password)
     * @return JWT 토큰
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginRequest) {
        String token = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(token);
    }

    /**
     * 비밀번호 재설정 엔드포인트
     * @param email 사용자 이메일
     * @param newPassword 새 비밀번호
     * @return 성공 메시지
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        authService.resetPassword(email, newPassword);
        return ResponseEntity.ok("비밀번호가 성공적으로 재설정되었습니다.");
    }
}