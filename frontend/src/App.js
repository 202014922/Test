import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ResetPassword from './components/Auth/ResetPassword';
import Home from './components/Home/Home';
import ProfileSettings from './components/Home/ProfileSettings';
import Notifications from './components/Home/Notifications';
import ChatList from './components/Home/ChatList';
import Match from './components/Home/Match';
import ChatRoom from './components/Chat/ChatRoom';
import Planner from './components/Planner/Planner';
import UserProfile from './components/Home/UserProfile'; // 추가된 컴포넌트
import WebSocketService from './services/WebSocketService';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthService from './services/AuthService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// 인증된 사용자만 접근할 수 있는 컴포넌트
const PrivateRoute = ({ children }) => {
  return AuthService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      WebSocketService.connect();
    }
    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  return (
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile-settings" element={<PrivateRoute><ProfileSettings /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/chats" element={<PrivateRoute><ChatList /></PrivateRoute>} />
            <Route path="/match" element={<PrivateRoute><Match /></PrivateRoute>} />
            <Route path="/chat/:chatId" element={<PrivateRoute><ChatRoom /></PrivateRoute>} />
            <Route path="/planner/:chatId" element={<PrivateRoute><Planner /></PrivateRoute>} />
            {/* **사용자 프로필 페이지 라우트 추가** */}
            <Route path="/user/:userId" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            {/* 추가 라우트 정의 */}
          </Routes>
        </Router>
      </ThemeProvider>
  );
}

export default App;