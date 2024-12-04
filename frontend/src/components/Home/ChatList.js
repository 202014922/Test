import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import {
    Container,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Button,
    Alert,
    Avatar,
    ListItemAvatar,
    CircularProgress,
    IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import AuthService from '../../services/AuthService';
import DeleteIcon from '@mui/icons-material/Delete'; // 삭제 아이콘 추가
import ConfirmDialog from './ConfirmDialog'; // 확인 다이얼로그 컴포넌트
import Header from '../../components/Header';

function ChatList() {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState({});
    const user = AuthService.getCurrentUser();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchChats = async () => {
            try {
                if (!user || !user.id) {
                    setError('사용자 정보가 올바르지 않습니다.');
                    setLoading(false);
                    return;
                }
                const response = await ApiService.getUserChats(user.id);
                const chatIds = response.data;
                setChats(chatIds);

                // 상대방 사용자 정보를 가져옵니다.
                const userIds = chatIds.map(chatId => {
                    const parts = chatId.split('_');
                    const smallerId = parseInt(parts[1]);
                    const largerId = parseInt(parts[2]);
                    return smallerId === user.id ? largerId : smallerId;
                });

                const uniqueUserIds = [...new Set(userIds)];
                const userPromises = uniqueUserIds.map(id => ApiService.getUserProfile(id));

                const usersData = await Promise.all(userPromises);
                const usersMap = {};
                usersData.forEach(userData => {
                    usersMap[userData.data.id] = userData.data;
                });
                setUsers(usersMap);
                setLoading(false);
            } catch (err) {
                console.error('채팅 목록을 불러오는 데 실패했습니다.', err);
                setError('채팅 목록을 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchChats();
    }, [user.id]);

    // 채팅방 삭제 확인 다이얼로그 열기
    const openDeleteDialog = (chatId) => {
        setSelectedChatId(chatId);
        setDeleteDialogOpen(true);
    };

    // 채팅방 삭제 확인 다이얼로그 닫기
    const closeDeleteDialog = () => {
        setSelectedChatId(null);
        setDeleteDialogOpen(false);
    };

    // 채팅방 삭제 핸들러
    const handleDeleteChat = async (chatId) => {
        try {
            await ApiService.deleteChat(chatId);
            // 삭제된 채팅방을 목록에서 제거
            setChats(prevChats => prevChats.filter(id => id !== chatId));
            setSuccessMessage('채팅방이 성공적으로 삭제되었습니다.');
            // 성공 메시지를 일정 시간 후에 사라지게 설정
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            console.error('채팅방 삭제에 실패했습니다.', err);
            setDeleteError('채팅방 삭제에 실패했습니다.');
            // 에러 메시지를 일정 시간 후에 사라지게 설정
            setTimeout(() => {
                setDeleteError('');
            }, 3000);
        }
    };

    if (error) {
        return (
            <Container style={{ textAlign: 'center', marginTop: '50px' }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!user || !users) {
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
                <Header />
                
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        채팅 목록
                    </Typography>
                    {/* 성공 메시지 표시 */}
                    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                    {/* 삭제 에러 메시지 표시 */}
                    {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : chats.length === 0 ? (
                        <Typography variant="body1" align="center">
                            채팅방이 없습니다.
                        </Typography>
                    ) : (
                        <List>
                            {chats.map((chatId, index) => {
                                // 상대방 사용자 ID 추출
                                const parts = chatId.split('_');
                                const smallerId = parseInt(parts[1]);
                                const largerId = parseInt(parts[2]);
                                const otherUserId = smallerId === user.id ? largerId : smallerId;
                                const otherUser = users[otherUserId];

                                return (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Button
                                                    component={Link}
                                                    to={`/chat/${chatId}`}
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ mr: 1 }}
                                                >
                                                    채팅하기
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    to={`/user/${otherUserId}`}
                                                    variant="outlined"
                                                    color="info"
                                                    sx={{ mr: 1 }}
                                                >
                                                    프로필 보기
                                                </Button>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    color="error"
                                                    onClick={() => openDeleteDialog(chatId)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        }
                                    >
                                        <ListItemAvatar>
                                            {otherUser && otherUser.profilePicture ? (
                                                <Avatar
                                                    src={`http://localhost:8080${otherUser.profilePicture}`}
                                                    alt={`${otherUser.username} 프로필`}
                                                />
                                            ) : (
                                                <Avatar>
                                                    {otherUser && otherUser.username
                                                        ? otherUser.username.charAt(0).toUpperCase()
                                                        : 'U'}
                                                </Avatar>
                                            )}
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`채팅 상대: ${otherUser ? otherUser.username : '유저 ' + otherUserId}`}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </Box>
            </motion.div>

            {/* 채팅방 삭제 확인 다이얼로그 */}
            {selectedChatId && (
                <ConfirmDialog
                    open={deleteDialogOpen}
                    title="채팅방 삭제"
                    content="정말 이 채팅방을 삭제하시겠습니까?"
                    onClose={closeDeleteDialog}
                    onConfirm={() => {
                        handleDeleteChat(selectedChatId);
                        closeDeleteDialog();
                    }}
                />
            )}
        </Container>
    );
}

export default ChatList;