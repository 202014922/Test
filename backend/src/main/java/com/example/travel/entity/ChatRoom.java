package com.example.travel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
public class ChatRoom {

    @Id
    private String chatId;

    private Long user1Id;
    private Long user2Id;

    private LocalDateTime createdAt;

    // Constructors
    public ChatRoom() {
    }

    public ChatRoom(String chatId, Long user1Id, Long user2Id) {
        this.chatId = chatId;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public Long getUser1Id() {
        return user1Id;
    }

    public void setUser1Id(Long user1Id) {
        this.user1Id = user1Id;
    }

    public Long getUser2Id() {
        return user2Id;
    }

    public void setUser2Id(Long user2Id) {
        this.user2Id = user2Id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // No setter for createdAt to ensure it's set only once
}