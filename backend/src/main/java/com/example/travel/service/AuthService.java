// AuthService.java
package com.example.travel.service;

import com.example.travel.entity.User;
import com.example.travel.repository.UserRepository;
import com.example.travel.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(User user) {
        if(userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("이미 존재하는 사용자 이름입니다.");
        }
        if(userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if(user.getRoles() == null || user.getRoles().isEmpty()){
            user.setRoles(List.of("USER"));
        }
        return userRepository.save(user);
    }

    public String login(String username, String password) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("잘못된 사용자 이름 또는 비밀번호입니다.");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return jwtUtil.generateToken(userDetails.getUsername());
    }

    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if(user == null) {
            throw new RuntimeException("존재하지 않는 이메일입니다.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}