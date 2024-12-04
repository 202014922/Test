package com.example.travel.service;

import com.example.travel.entity.Chat;
import com.example.travel.entity.ChatRoom;
import com.example.travel.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ChatRoomService chatRoomService;

    /**
     * 메시지를 보내고 저장합니다.
     *
     * @param chatId    채팅 방 ID
     * @param senderId  발신자 ID
     * @param content   메시지 내용
     * @return 저장된 메시지
     */
    public Chat sendMessage(String chatId, Long senderId, String content) {
        // 채팅 방이 존재하는지 확인
        Optional<ChatRoom> chatRoomOpt = chatRoomService.getChatRoomById(chatId);
        if (!chatRoomOpt.isPresent()) {
            throw new RuntimeException("채팅 방이 존재하지 않습니다.");
        }

        Chat chat = new Chat();
        chat.setChatId(chatId);
        chat.setSenderId(senderId);
        chat.setContent(content);
        chat.setTimestamp(LocalDateTime.now());
        return chatRepository.save(chat);
    }

    /**
     * 특정 채팅 방의 메시지들을 가져옵니다.
     *
     * @param chatId 채팅 방 ID
     * @return 메시지 리스트
     */
    public List<Chat> getMessages(String chatId) {
        return chatRepository.findByChatId(chatId);
    }

    /**
     * 사용자의 채팅 목록을 가져옵니다.
     *
     * @param userId 사용자 ID
     * @return 채팅 방 ID 리스트
     */
    public List<String> getUserChats(Long userId) {
        List<ChatRoom> userChatRooms = chatRoomService.getChatRoomsByUserId(userId);
        Set<String> chatIds = new HashSet<>();
        for (ChatRoom room : userChatRooms) {
            chatIds.add(room.getChatId());
        }
        return new ArrayList<>(chatIds);
    }

    /**
     * 채팅 방을 생성합니다.
     *
     * @param chatId   채팅 방 ID
     * @param user1Id  사용자 1 ID
     * @param user2Id  사용자 2 ID
     * @return 생성된 채팅 방
     */
    public ChatRoom createChatRoom(String chatId, Long user1Id, Long user2Id) {
        return chatRoomService.createChatRoom(chatId, user1Id, user2Id);
    }

    /**
     * 채팅 방을 삭제합니다.
     *
     * @param chatId 채팅 방 ID
     */
    @Transactional
    public void deleteChatRoom(String chatId) {
        // 채팅 방이 존재하는지 확인
        Optional<ChatRoom> chatRoomOpt = chatRoomService.getChatRoomById(chatId);
        if (!chatRoomOpt.isPresent()) {
            throw new RuntimeException("채팅 방이 존재하지 않습니다.");
        }

        // 해당 채팅 방의 모든 메시지 삭제
        chatRepository.deleteByChatId(chatId);

        // 채팅 방 삭제
        chatRoomService.deleteChatRoom(chatId);
    }
}