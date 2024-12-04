// AuthService.js
import ApiServiceMethods from './ApiService';

class AuthService {
    signup(users) {
        return ApiServiceMethods.signup(users)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error('회원가입 실패:', error);
                throw error;
            });
    }

    login(credentials) {
        return ApiServiceMethods.login(credentials)
            .then(response => {
                const token = response.data; // 응답의 data에서 토큰 추출
                if (token) {
                    // 토큰과 사용자 ID를 로컬 스토리지에 저장
                    const decoded = this.decodeToken(token);
                    const users = { token, id: decoded.id };
                    localStorage.setItem('users', JSON.stringify(users));
                }
                return token;
            })
            .catch(error => {
                console.error('로그인 실패:', error);
                throw error;
            });
    }

    resetPassword(email, newPassword) {
        return ApiServiceMethods.resetPassword(email, newPassword)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error('비밀번호 재설정 실패:', error);
                throw error;
            });
    }

    logout() {
        localStorage.removeItem('users');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('users'));
    }

    isAuthenticated() {
        const users = this.getCurrentUser();
        return users && users.token;
    }

    decodeToken(token) {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return { id: decoded.id, username: decoded.sub };
        } catch (e) {
            console.error('토큰 디코딩 실패:', e);
            return {};
        }
    }
}

export default new AuthService();