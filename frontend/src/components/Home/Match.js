import React, { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';
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
    ListItemAvatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom'; // 네비게이션 훅 추가
import Header from '../../components/Header';

function Match() {
    const [matches, setMatches] = useState([]);
    const user = AuthService.getCurrentUser();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // 네비게이션 훅 초기화

    useEffect(() => {
        // 매칭된 사용자 리스트 가져오기
        ApiService.findMatches(user.id)
            .then(response => {
                setMatches(response.data);
            })
            .catch(error => {
                console.error('매칭 목록 불러오기 실패:', error);
                setError('매칭 목록을 불러오는데 실패했습니다.');
            });
    }, [user.id]);

    const handleSelect = async (matchUser) => {
        try {
            const newMatch = {
                user1Id: user.id,
                user2Id: matchUser.id,
                status: '대기'
            };
            const response = await ApiService.createMatch(newMatch);
            if(response.data) {
                setMessage('매칭 요청이 성공적으로 전송되었습니다.');
                setError('');
            }
        } catch (error) {
            setError('매칭 요청 실패: 다시 시도해주세요.');
            setMessage('');
            console.error('매칭 요청 실패:', error);
        }
    };

    const handleViewProfile = (userId) => {
        navigate(`/user/${userId}`);
    };

    return (
        <Container maxWidth="sm">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <Header />

                <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        매칭 목록
                    </Typography>
                    {message && <Alert severity="success">{message}</Alert>}
                    {error && <Alert severity="error">{error}</Alert>}
                    {matches.length === 0 ? (
                        <Typography variant="body1" align="center">
                            매칭된 사용자가 없습니다.
                        </Typography>
                    ) : (
                        <List>
                            {matches.map(match => (
                                <ListItem key={match.matchId} sx={{ mb: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                                    <ListItemAvatar>
                                        {match.user.profilePicture ? (
                                            <Avatar src={`http://localhost:8080${match.user.profilePicture}`} alt={`${match.user.username} 프로필`} />
                                        ) : (
                                            <Avatar>{match.user.username.charAt(0).toUpperCase()}</Avatar>
                                        )}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={match.user.username}
                                        secondary={`유사성: ${match.similarityScore.toFixed(2)}%`}
                                    />
                                    <Box>
                                        <Button variant="contained" color="primary" onClick={() => handleSelect(match.user)} sx={{ mr: 1 }}>
                                            매칭 요청
                                        </Button>
                                        <Button variant="outlined" color="secondary" onClick={() => handleViewProfile(match.user.id)}>
                                            프로필 보기
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

export default Match;