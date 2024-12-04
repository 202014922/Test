import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Grid, Card, CardContent, Avatar, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import AuthService from '../../services/AuthService';
import ApiService from '../../services/ApiService';
import Header from '../../components/Header';

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const boxRef = useRef(null); // Box 컴포넌트의 참조
    const [boxWidth, setBoxWidth] = useState(0); // Box의 너비 상태

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const currentUser = AuthService.getCurrentUser();
                if (!currentUser || !currentUser.id) {
                    throw new Error('사용자 정보가 없습니다.');
                }
                const response = await ApiService.getUserProfile(currentUser.id);
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                console.error('사용자 정보를 불러오는 중 오류 발생:', err);
                setError('사용자 정보를 불러오는 데 실패했습니다.');
                setLoading(false);
                if (err.response && err.response.status === 401) {
                    AuthService.logout();
                    navigate('/login');
                }
            }
        };

        fetchUserProfile();

        const preventBack = () => {
            window.history.pushState(null, '', window.location.href);
            window.onpopstate = () => {
                window.history.pushState(null, '', window.location.href);
            };
        };

        preventBack();

        return () => {
            window.onpopstate = null;
        };
    }, [navigate]);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    // Box의 너비를 계산하여 상태에 저장
    useEffect(() => {
        if (boxRef.current) {
            setBoxWidth(boxRef.current.offsetWidth); // Box의 너비를 상태에 저장
        }
    }, [user]); // user가 변경될 때마다 Box 크기를 계산하도록 변경

    if (loading) {
        return (
            <Container style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ textAlign: 'center', marginTop: '50px' }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ pt: 4 }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <Header />

                <Box ref={boxRef} sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user && user.profilePicture ? (
                        <Avatar
                            alt={user.username}
                            src={`http://localhost:8080${user.profilePicture}`}
                            sx={{ width: 120, height: 120, mr: 3, border: '3px solid #fff' }}
                        />
                    ) : (
                        <Avatar sx={{ width: 120, height: 120, mr: 3, backgroundColor: '#1976d2' }}>
                            {user && user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                    )}
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        안녕하세요, {user && user.username ? user.username : 'User'}님!
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <Link to="/profile-settings" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                            프로필 설정
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        여행 성향 및 선호도를 설정하세요.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <Link to="/match" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                            매칭
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        여행 동반자를 찾아보세요.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <Link to="/chats" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                            채팅
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        친구들과 채팅을 나눠보세요.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <Link to="/notifications" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                            알림
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        새로운 알림을 확인하세요.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleLogout}
                        sx={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            borderRadius: '20px',
                            boxShadow: 3,
                        }}
                    >
                        로그아웃
                    </Button>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={require('../../assets/images/logo.png')}
                        alt="Logo"
                        style={{
                            width: boxWidth * 0.5, // Box의 너비에 맞추기
                            height: 'auto',  // 비율 유지
                            objectFit: 'contain', // 비율을 유지하면서 맞추기
                        }}
                    />
                </Box>
            </motion.div>
        </Container>
    );
}

export default Home;
