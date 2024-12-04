package com.example.travel.repository;

import com.example.travel.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    List<ChatRoom> findByUser1IdOrUser2Id(Long user1Id, Long user2Id);
}