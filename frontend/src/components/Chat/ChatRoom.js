import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import ApiService from '../../services/ApiService';
import WebSocketService from '../../services/WebSocketService';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Alert,
    Avatar,
    ListItemAvatar,
    CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import AuthService from '../../services/AuthService';

function ChatRoom() {
    const { chatId } = useParams();
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [user, setUser] = useState(null); // 현재 사용자 정보
    const [otherUser, setOtherUser] = useState(null); // 상대방 사용자 정보
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);
    const subscriptionRef = useRef(null); // 구독 객체를 저장할 ref

    useEffect(() => {
        const fetchUserAndChatInfo = async () => {
            try {
                const currentUser = AuthService.getCurrentUser();
                if (!currentUser || !currentUser.id) {
                    throw new Error('사용자 정보가 올바르지 않습니다.');
                }

                // 현재 사용자 프로필 가져오기
                const userResponse = await ApiService.getUserProfile(currentUser.id);
                setUser(userResponse.data);

                // 채팅방 상대방 사용자 ID 추출
                const parts = chatId.split('_');
                if (parts.length < 3) {
                    throw new Error('채팅 ID 형식이 올바르지 않습니다.');
                }
                const smallerId = parseInt(parts[1], 10);
                const largerId = parseInt(parts[2], 10);
                const otherUserId = smallerId === currentUser.id ? largerId : smallerId;

                // 상대방 사용자 프로필 가져오기
                const otherUserResponse = await ApiService.getUserProfile(otherUserId);
                setOtherUser(otherUserResponse.data);

                // 메시지 불러오기
                const messagesResponse = await ApiService.getMessages(chatId);
                setMessages(messagesResponse.data);
                scrollToBottom();
            } catch (err) {
                console.error('데이터를 불러오는 중 오류 발생:', err);
                setError(err.message || '데이터를 불러오는 데 실패했습니다.');
                setUser(null);
                setOtherUser(null);
                setMessages([]);
                if (err.response && err.response.status === 401) {
                    AuthService.logout();
                    navigate('/login');
                }
            }
        };

        fetchUserAndChatInfo();

        // WebSocket 연결
        WebSocketService.connect();

        // WebSocket 메시지 핸들러 정의
        const handleMessage = (message) => {
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        };

        // WebSocket 구독 설정 및 구독 객체 저장
        subscriptionRef.current = WebSocketService.subscribe(`/topic/chat/${chatId}`, handleMessage);

        return () => {
            // 컴포넌트 언마운트 시 구독 해제 및 WebSocket 연결 종료
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            WebSocketService.disconnect();
        };
    }, [chatId, navigate]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSend = async () => {
        if (input.trim() === '') return;
        const message = {
            chatId,
            senderId: user.id,
            content: input,
            timestamp: new Date().toISOString()
        };
        try {
            await ApiService.sendMessage(message);
            setInput('');
            // 메시지는 WebSocket을 통해 다시 수신됩니다.
        } catch (err) {
            console.error('메시지 전송에 실패했습니다.', err);
            setError('메시지 전송에 실패했습니다.');
        }
    };

    if (error) {
        return (
            <Container style={{ textAlign: 'center', marginTop: '50px' }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!user || !otherUser) {
        return (
            <Container style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        채팅방: {chatId}
                    </Typography>
                    <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                        {messages.map((msg, index) => (
                            <ListItem key={index} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar
                                        src={
                                            msg.senderId === user.id
                                                ? user.profilePicture
                                                    ? `http://localhost:8080${user.profilePicture}`
                                                    : null
                                                : otherUser.profilePicture
                                                    ? `http://localhost:8080${otherUser.profilePicture}`
                                                    : null
                                        }
                                        alt={
                                            msg.senderId === user.id
                                                ? `${user.username || '사용자'} 프로필`
                                                : `${otherUser.username || '사용자'} 프로필`
                                        }
                                    >
                                        {msg.senderId === user.id
                                            ? (user.username ? user.username.charAt(0).toUpperCase() : 'U')
                                            : (otherUser.username ? otherUser.username.charAt(0).toUpperCase() : 'U')}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        msg.senderId === user.id
                                            ? '나'
                                            : otherUser.username
                                                ? otherUser.username
                                                : `유저 ${msg.senderId}`
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {msg.content}
                                            </Typography>
                                            {" — " + new Date(msg.timestamp).toLocaleString()}
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                        <div ref={messagesEndRef} />
                    </List>
                    <Box sx={{ display: 'flex', mt: 2 }}>
                        <TextField
                            label="메시지 입력"
                            variant="outlined"
                            fullWidth
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <Button variant="contained" color="primary" onClick={handleSend} sx={{ ml: 2 }}>
                            전송
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button component={Link} to={`/planner/${chatId}`} variant="outlined" color="secondary">
                            플래너 작성
                        </Button>
                        <Button component={Link} to="/chats" variant="outlined" color="secondary" sx={{ ml: 2 }}>
                            채팅 목록
                        </Button>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
}

export default ChatRoom;
