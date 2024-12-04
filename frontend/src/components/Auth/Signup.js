import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    //const navigate = useNavigate();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await AuthService.signup({ username, password, email });
            setMessage('회원가입이 성공적으로 완료되었습니다. 로그인 해주세요.');
            setError('');
            setUsername('');
            setPassword('');
            setEmail('');
        } catch (err) {
            setError('회원가입에 실패했습니다. 입력한 정보를 확인하세요.');
            setMessage('');
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
                        회원가입
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {message && <Alert severity="success">{message}</Alert>}
                    <Box component="form" onSubmit={handleSignup} sx={{ mt: 2 }}>
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
                            label="이메일"
                            variant="outlined"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            회원가입
                        </Button>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography>
                                이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
}

export default Signup;