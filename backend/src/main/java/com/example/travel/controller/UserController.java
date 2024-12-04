package com.example.travel.controller;

import com.example.travel.entity.User;
import com.example.travel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    private final String uploadDir = "./uploads/";

    /**
     * 프로필 사진 업로드 엔드포인트
     * @param file 업로드할 파일
     * @param userId 사용자 ID
     * @return 파일 URL 또는 에러 메시지
     */
    @PostMapping("/upload-profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file, @RequestParam("userId") Long userId) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("파일이 비어있습니다.");
        }

        try {
            // 업로드 디렉토리 생성
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 고유 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // 파일 저장
            Path filePath = Paths.get(uploadDir + uniqueFilename);
            Files.write(filePath, file.getBytes());

            // 사용자 프로필에 파일 URL 업데이트
            String fileUrl = "/uploads/" + uniqueFilename;
            userService.updateProfilePicture(userId, fileUrl);

            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드에 실패했습니다.");
        }
    }

    /**
     * 사용자 프로필 가져오기 엔드포인트
     * @param id 사용자 ID
     * @return 사용자 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        try {
            User user = userService.getUserProfile(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 사용자 프로필 업데이트 엔드포인트
     * @param updatedUser 업데이트된 사용자 정보
     * @return 업데이트된 사용자 정보
     */
    @PutMapping("/update")
    public ResponseEntity<User> updateUserProfile(@RequestBody User updatedUser) {
        try {
            User user = userService.updateUserProfile(updatedUser);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // 기타 필요한 메서드들...
}