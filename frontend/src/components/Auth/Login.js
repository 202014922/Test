import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('로그인 시도:', { username, password }); // 디버깅 로그 추가
        try {
            const token = await AuthService.login({ username, password }); // 토큰 반환
            console.log('로그인 토큰:', token); // 토큰 확인
            navigate('/home');
        } catch (err) {
            console.error('로그인 에러:', err); // 에러 로그 추가
            if (err.response && err.response.data) {
                setError(err.response.data.message || '로그인에 실패했습니다. 사용자 이름과 비밀번호를 확인하세요.');
            } else {
                setError('로그인에 실패했습니다. 사용자 이름과 비밀번호를 확인하세요.');
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mt: 8 }}>
                    <Typography variant="h4" gutterBottom>
                        로그인
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                        <TextField
                            label="사용자 이름"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            label="비밀번호"
                            variant="outlined"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            로그인
                        </Button>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography>
                                계정이 없으신가요? <Link to="/signup">회원가입</Link>
                            </Typography>
                            <Typography>
                                비밀번호를 잊으셨나요? <Link to="/reset-password">비밀번호 재설정</Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
}

export default Login;