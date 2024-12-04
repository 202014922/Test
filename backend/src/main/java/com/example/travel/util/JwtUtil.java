// JwtUtil.java
package com.example.travel.util;

import com.example.travel.entity.User;
import com.example.travel.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // 최소 256비트(32바이트) 이상의 비밀 키 사용 권장
    private final String SECRET_KEY = "your_secret_key_your_secret_key_your_secret_key!"; // 예시 키, 실제 사용 시 안전하게 관리하세요
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    @Autowired
    private UserRepository userRepository;

    // JWT 토큰 생성
    public String generateToken(String username) {
        Long userId = getUserId(username);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10시간 유효
                .signWith(key, SignatureAlgorithm.HS256)
                .claim("id", userId) // 사용자 ID를 클레임에 추가
                .compact();
    }

    // 사용자 이름으로 사용자 ID 가져오기
    private Long getUserId(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            return user.getId();
        } else {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
    }

    // 사용자 이름 추출
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    // 클레임 추출
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}