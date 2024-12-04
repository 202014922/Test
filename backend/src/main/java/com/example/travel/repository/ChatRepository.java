package com.example.travel.repository;

import com.example.travel.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByChatId(String chatId);
    List<Chat> findBySenderId(Long senderId);

    // **채팅방 ID로 메시지 삭제 메서드 추가**
    @Modifying
    @Transactional
    @Query("DELETE FROM Chat c WHERE c.chatId = :chatId")
    void deleteByChatId(String chatId);
}