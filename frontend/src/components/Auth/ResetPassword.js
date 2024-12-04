import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    //const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await AuthService.resetPassword(email, newPassword);
            setMessage('비밀번호가 성공적으로 재설정되었습니다.');
            setError('');
            setEmail('');
            setNewPassword('');
        } catch (err) {
            setError('비밀번호 재설정에 실패했습니다. 이메일을 확인하세요.');
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
                        비밀번호 재설정
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {message && <Alert severity="success">{message}</Alert>}
                    <Box component="form" onSubmit={handleReset} sx={{ mt: 2 }}>
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
                            label="새 비밀번호"
                            variant="outlined"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            비밀번호 재설정
                        </Button>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography>
                                비밀번호를 기억하셨나요? <Link to="/login">로그인</Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
}

export default ResetPassword;