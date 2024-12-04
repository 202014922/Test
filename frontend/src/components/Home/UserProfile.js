import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import {
    Container,
    Typography,
    Box,
    Avatar,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemText,
    Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import Header from '../../components/Header';

function UserProfile() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile(userId);
                setProfile(response.data);
            } catch (err) {
                console.error('프로필 불러오기 실패:', err);
                setError('프로필을 불러오는 데 실패했습니다.');
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    if (error) {
        return (
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Header />

                    <Box sx={{ mt: 4 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                </motion.div>
            </Container>
        );
    }

    if (!profile) {
        return (
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Header />

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" align="center">로딩 중...</Typography>
                    </Box>
                </motion.div>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <Header />
                
                <Box sx={{ mt: 4, p: 4, boxShadow: 3, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                        {/* 프로필 사진 */}
                        <Grid item xs={12} sm={4}>
                            <Avatar
                                src={profile.profilePicture ? `http://localhost:8080${profile.profilePicture}` : ''}
                                alt={`${profile.username} 프로필`}
                                sx={{ width: 200, height: 200, margin: 'auto' }}
                            />
                        </Grid>

                        {/* 기본 정보 및 자기소개 */}
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h5" gutterBottom>
                                {profile.username}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                {profile.bio || '자기소개가 없습니다.'}
                            </Typography>

                            <Typography variant="body1" gutterBottom>
                                <strong>여행 성향:</strong> {profile.travelStyle || '설정되지 않음'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>선호하는 여행지:</strong> {profile.preferredDestination || '설정되지 않음'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>예산:</strong> {profile.budget || '설정되지 않음'}
                            </Typography>

                            {/* 취미 목록 */}
                            <Typography variant="body1" gutterBottom>
                                <strong>취미:</strong>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                    {profile.hobbies && profile.hobbies.length > 0 ? (
                                        profile.hobbies.map((hobby, index) => (
                                            <Chip key={index} label={hobby} />
                                        ))
                                    ) : (
                                        <Typography variant="body2">취미가 없습니다.</Typography>
                                    )}
                                </Box>
                            </Typography>

                            {/* 관심사 목록 */}
                            <Typography variant="body1" gutterBottom>
                                <strong>관심사:</strong>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                    {profile.interests && profile.interests.length > 0 ? (
                                        profile.interests.map((interest, index) => (
                                            <Chip key={index} label={interest} />
                                        ))
                                    ) : (
                                        <Typography variant="body2">관심사가 없습니다.</Typography>
                                    )}
                                </Box>
                            </Typography>

                            {/* 여행 가능 날짜 */}
                            <Typography variant="body1" gutterBottom>
                                <strong>여행 가능 날짜:</strong>
                                {profile.availableTravelDates && profile.availableTravelDates.length > 0 ? (
                                    <List>
                                        {profile.availableTravelDates.map((date, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={new Date(date).toLocaleDateString()} />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2">여행 가능 날짜가 설정되지 않았습니다.</Typography>
                                )}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </motion.div>
        </Container>
    );
}

export default UserProfile;