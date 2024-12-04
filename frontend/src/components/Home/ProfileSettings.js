import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Grid,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Header from '../../components/Header';

function ProfileSettings() {
    const userData = AuthService.getCurrentUser();
    const [user, setUser] = useState(null);
    const [travelStyle, setTravelStyle] = useState('');
    const [preferredDestination, setPreferredDestination] = useState('');
    const [hobbies, setHobbies] = useState([]); // 빈 배열로 초기화
    const [interests, setInterests] = useState([]);
    const [profilePicture, setProfilePicture] = useState('');
    const [budget, setBudget] = useState('');
    const [availableDates, setAvailableDates] = useState([]);
    const [bio, setBio] = useState(''); // 자기소개 상태 추가
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const travelStylesOptions = ['모험', '휴식', '문화 탐험', '자연 탐방', '쇼핑']; // 예시
    const preferredDestinationsOptions = ['서울', '부산', '제주도', '경주', '강릉']; // 예시
    const hobbiesList = ['등산', '사진', '요리', '독서', '스노보드']; // 예시
    const interestsList = ['미술', '음악', '기술', '스포츠', '패션']; // 예시
    const budgetRanges = ['50만원 이하', '50-100만원', '100-200만원', '200만원 이상']; // 예시

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!userData || !userData.id) {
                    throw new Error('사용자 정보가 없습니다.');
                }
                const response = await ApiService.getUserProfile(userData.id);
                setUser(response.data);
                setTravelStyle(response.data.travelStyle || '');
                setPreferredDestination(response.data.preferredDestination || '');
                setHobbies(response.data.hobbies || []); // 배열로 설정
                setInterests(response.data.interests || []);
                setProfilePicture(response.data.profilePicture ? `http://localhost:8080${response.data.profilePicture}` : '');
                setBudget(response.data.budget || '');
                setAvailableDates(response.data.availableTravelDates || []);
                setBio(response.data.bio || ''); // 자기소개 설정
            } catch (err) {
                console.error('프로필 불러오기 실패:', err);
                setError('프로필을 불러오는 데 실패했습니다.');
            }
        };

        if (userData?.id) {
            fetchUserProfile();
        }
    }, [userData?.id]); // 의존성 배열을 userData.id로 변경

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setProfilePicture(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleRemoveDate = (date) => {
        setAvailableDates(availableDates.filter(d => d !== date));
    };

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0];
            if (!availableDates.includes(formattedDate)) {
                setAvailableDates([...availableDates, formattedDate]);
            }
        }
    };

    const handleHobbiesChange = (e) => {
        console.log('선택된 취미:', e.target.value);
        setHobbies(e.target.value);
    };

    const handleInterestsChange = (e) => {
        console.log('선택된 관심사:', e.target.value);
        setInterests(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = {
                ...user,
                travelStyle,
                preferredDestination,
                hobbies, // 배열 형태로 전송
                interests,
                budget,
                availableTravelDates: availableDates,
                bio, // 자기소개 포함
            };

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile); // 서버에서 'file'로 기대함
                formData.append('userId', userData.id);
                const uploadResponse = await ApiService.uploadProfilePicture(formData);
                updatedUser.profilePicture = uploadResponse.data; // 서버에서 반환된 파일 URL 사용
            }

            await ApiService.updateUserProfile(updatedUser);
            setMessage('프로필이 성공적으로 업데이트되었습니다.');
            setError('');
        } catch (err) {
            console.error('프로필 업데이트 실패:', err);
            setError('프로필 업데이트에 실패했습니다.');
            setMessage('');
        }
    };

    return (
        <Container maxWidth="md">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <Header />

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        프로필 설정
                    </Typography>
                    {message && <Alert severity="success">{message}</Alert>}
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>여행 성향</InputLabel>
                                    <Select
                                        value={travelStyle}
                                        label="여행 성향"
                                        onChange={(e) => setTravelStyle(e.target.value)}
                                        required
                                    >
                                        {travelStylesOptions.map((style) => (
                                            <MenuItem key={style} value={style}>{style}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>선호하는 여행지</InputLabel>
                                    <Select
                                        value={preferredDestination}
                                        label="선호하는 여행지"
                                        onChange={(e) => setPreferredDestination(e.target.value)}
                                        required
                                    >
                                        {preferredDestinationsOptions.map((destination) => (
                                            <MenuItem key={destination} value={destination}>{destination}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>취미</InputLabel>
                                    <Select
                                        multiple
                                        value={hobbies}
                                        label="취미"
                                        onChange={handleHobbiesChange}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {hobbiesList.map((hobby) => (
                                            <MenuItem key={hobby} value={hobby}>
                                                {hobby}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>관심사</InputLabel>
                                    <Select
                                        multiple
                                        value={interests}
                                        label="관심사"
                                        onChange={handleInterestsChange}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                        required
                                    >
                                        {interestsList.map((interest) => (
                                            <MenuItem key={interest} value={interest}>
                                                {interest}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>예산</InputLabel>
                                    <Select
                                        value={budget}
                                        label="예산"
                                        onChange={(e) => setBudget(e.target.value)}
                                        required
                                    >
                                        {budgetRanges.map((range) => (
                                            <MenuItem key={range} value={range}>{range}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="자기소개"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={bio}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 500) { // 500자 제한
                                            setBio(e.target.value);
                                        }
                                    }}
                                    helperText={`${bio.length}/500자`}
                                    placeholder="간단한 자기소개를 입력해주세요."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle1">프로필 사진</Typography>
                                {profilePicture && (
                                    <Box sx={{ mb: 2 }}>
                                        <img src={profilePicture} alt="프로필" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }} />
                                    </Box>
                                )}
                                <Button variant="contained" component="label">
                                    사진 업로드
                                    <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                                </Button>
                                {selectedFile && <Typography variant="body2" sx={{ mt: 1 }}>{selectedFile.name}</Typography>}
                            </Grid>

                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="여행 가능 날짜 선택"
                                        onChange={handleDateChange}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                        disablePast
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle1">선택된 날짜</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                    {availableDates.map((date, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#e0e0e0', borderRadius: 1, px: 2, py: 1 }}>
                                            <Typography>{date}</Typography>
                                            <Button size="small" color="error" onClick={() => handleRemoveDate(date)}>
                                                X
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            업데이트
                        </Button>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
}

export default ProfileSettings;