package com.example.travel.service;

import com.example.travel.entity.ChatRoom;
import com.example.travel.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    /**
     * 새로운 채팅 방을 생성합니다.
     *
     * @param chatId  채팅 방 ID
     * @param user1Id 사용자 1 ID
     * @param user2Id 사용자 2 ID
     * @return 생성된 채팅 방
     */
    public ChatRoom createChatRoom(String chatId, Long user1Id, Long user2Id) {
        ChatRoom chatRoom = new ChatRoom(chatId, user1Id, user2Id);
        return chatRoomRepository.save(chatRoom);
    }

    /**
     * 채팅 방을 ID로 조회합니다.
     *
     * @param chatId 채팅 방 ID
     * @return 채팅 방 Optional
     */
    public Optional<ChatRoom> getChatRoomById(String chatId) {
        return chatRoomRepository.findById(chatId);
    }

    /**
     * 사용자 ID로 채팅 방들을 조회합니다.
     *
     * @param userId 사용자 ID
     * @return 채팅 방 리스트
     */
    public List<ChatRoom> getChatRoomsByUserId(Long userId) {
        return chatRoomRepository.findByUser1IdOrUser2Id(userId, userId);
    }

    /**
     * 채팅 방을 삭제합니다.
     *
     * @param chatId 채팅 방 ID
     */
    public void deleteChatRoom(String chatId) {
        chatRoomRepository.deleteById(chatId);
    }
}