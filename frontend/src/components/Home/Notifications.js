import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { Container, Typography, Box, List, ListItem, ListItemText, Button, Alert, Avatar, ListItemAvatar } from '@mui/material';
import { motion } from 'framer-motion';
import AuthService from '../../services/AuthService';
import Header from '../../components/Header';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const user = AuthService.getCurrentUser();

    useEffect(() => {
        // 알림 데이터를 가져오는 로직 구현
        ApiService.getNotifications(user.id)
            .then(response => {
                setNotifications(response.data);
            })
            .catch(error => {
                console.error('알림 목록 불러오기 실패:', error);
                setError('알림 목록을 불러오는데 실패했습니다.');
            });
    }, [user.id]);

    const handleAccept = async (matchId, matchedUserId) => {
        try {
            await ApiService.acceptMatch(matchId);
            setMessage('매칭 요청을 수락했습니다.');
            setError('');
            // 알림 리스트에서 해당 매칭 제거
            setNotifications(notifications.filter(notif => notif.matchId !== matchId));

            // 채팅 목록에 채팅 방 추가 (채팅 방 ID는 백엔드에서 생성되므로 클라이언트에서 재요청)
            // Alternatively, you can generate the chatId here as per localhost logic
            const smallerId = Math.min(user.id, matchedUserId);
            const largerId = Math.max(user.id, matchedUserId);
            //const chatId = `chat_${smallerId}_${largerId}`;

            // 채팅 목록을 새로고침하여 방이 추가되었는지 확인
            // Alternatively, you can optimistically add the chatId to ChatList's state
            // but here we will leave it to ChatList to fetch updated list
        } catch (error) {
            console.error('매칭 수락 실패:', error);
            setError('매칭 수락에 실패했습니다.');
            setMessage('');
        }
    };

    const handleReject = async (matchId) => {
        try {
            await ApiService.rejectMatch(matchId);
            setMessage('매칭 요청을 거절했습니다.');
            setError('');
            // 알림 리스트에서 해당 매칭 제거
            setNotifications(notifications.filter(notif => notif.matchId !== matchId));
        } catch (error) {
            console.error('매칭 거절 실패:', error);
            setError('매칭 거절에 실패했습니다.');
            setMessage('');
        }
    };

    return (
        <Container maxWidth="sm">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Header />

                <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        알림
                    </Typography>
                    {message && <Alert severity="success">{message}</Alert>}
                    {error && <Alert severity="error">{error}</Alert>}
                    {notifications.length === 0 ? (
                        <Typography variant="body1" align="center">
                            알림이 없습니다.
                        </Typography>
                    ) : (
                        <List>
                            {notifications.map(notif => (
                                <ListItem key={notif.matchId} sx={{ mb: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                                    <ListItemAvatar>
                                        {notif.user.profilePicture ? (
                                            <Avatar src={`http://localhost:8080${notif.user.profilePicture}`} alt={`${notif.user.username} 프로필`} />
                                        ) : (
                                            <Avatar>{notif.user.username.charAt(0).toUpperCase()}</Avatar>
                                        )}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${notif.user.username}님으로부터 매칭 요청이 도착했습니다.`}
                                        secondary={`유사성: ${notif.similarityScore.toFixed(2)}%`}
                                    />
                                    <Box>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ mr: 1 }}
                                            onClick={() => handleAccept(notif.matchId, notif.user.id)}
                                        >
                                            수락
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleReject(notif.matchId)}
                                        >
                                            거절
                                        </Button>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </motion.div>
        </Container>
    );
}

export default Notifications;