// src/components/Home/Planner.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Alert, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';

function Planner() {
    const { chatId } = useParams();
    const [planners, setPlanners] = useState([]);
    const [schedule, setSchedule] = useState('');
    const [budget, setBudget] = useState('');
    const [location, setLocation] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPlanners = async () => {
            try {
                const response = await ApiService.getPlanners(chatId);
                setPlanners(response.data);
            } catch (err) {
                setError('플래너를 불러오는 데 실패했습니다.');
            }
        };

        fetchPlanners();
    }, [chatId]);

    const handleCreate = async () => {
        if (schedule.trim() === '' || budget === '' || location.trim() === '' || time.trim() === '') {
            setError('모든 필드를 채워주세요.');
            setMessage('');
            return;
        }
        const planner = { chatId, schedule, budget, location, time };
        try {
            await ApiService.createPlanner(planner);
            setMessage('플래너가 성공적으로 생성되었습니다.');
            setError('');
            setSchedule('');
            setBudget('');
            setLocation('');
            setTime('');
            // 플래너 목록 갱신
            const response = await ApiService.getPlanners(chatId);
            setPlanners(response.data);
        } catch (err) {
            setError('플래너 생성에 실패했습니다.');
            setMessage('');
        }
    };

    const handleUpdate = async (plannerId) => {
        const planner = planners.find(p => p.id === plannerId);
        const updatedSchedule = prompt('새로운 일정:', planner.schedule);
        if (updatedSchedule === null) return; // 취소 시
        const updatedPlanner = { ...planner, schedule: updatedSchedule };
        try {
            await ApiService.updatePlanner(updatedPlanner);
            setMessage('플래너가 성공적으로 업데이트되었습니다.');
            setError('');
            // 플래너 목록 갱신
            const response = await ApiService.getPlanners(chatId);
            setPlanners(response.data);
        } catch (err) {
            setError('플래너 업데이트에 실패했습니다.');
            setMessage('');
        }
    };

    const handleDelete = async (plannerId) => {
        if (!window.confirm('정말 이 플래너를 삭제하시겠습니까?')) return;
        try {
            await ApiService.deletePlanner(plannerId);
            setMessage('플래너가 성공적으로 삭제되었습니다.');
            setError('');
            // 플래너 목록 갱신
            const response = await ApiService.getPlanners(chatId);
            setPlanners(response.data);
        } catch (err) {
            setError('플래너 삭제에 실패했습니다.');
            setMessage('');
        }
    };

    return (
        <Container maxWidth="md">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        플래너: {chatId}
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {message && <Alert severity="success">{message}</Alert>}
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            label="일정"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                        />
                        <TextField
                            label="예산"
                            variant="outlined"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                        <TextField
                            label="위치"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <TextField
                            label="시간"
                            variant="outlined"
                            type="time"
                            fullWidth
                            margin="normal"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5분 단위
                            }}
                        />
                        <Button variant="contained" color="primary" onClick={handleCreate} fullWidth sx={{ mt: 2 }}>
                            플래너 생성
                        </Button>
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        플래너 목록
                    </Typography>
                    <List>
                        {planners.map(planner => (
                            <ListItem
                                key={planner.id}
                                secondaryAction={
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleUpdate(planner.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            수정
                                        </Button>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            color="error"
                                            onClick={() => handleDelete(planner.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                }
                            >
                                <ListItemText
                                    primary={`일정: ${planner.schedule}`}
                                    secondary={`예산: ${planner.budget} | 위치: ${planner.location} | 시간: ${planner.time}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ mt: 2 }}>
                        <Button component={Link} to={`/chat/${chatId}`} variant="outlined" color="secondary">
                            채팅으로 돌아가기
                        </Button>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
}

export default Planner;