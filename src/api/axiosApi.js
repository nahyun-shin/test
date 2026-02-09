import axios from 'axios';
import { useAuthStore } from '../pages/store/authStore';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. 요청 인터셉터 (토큰 주입)
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

// 2. 응답 인터셉터 (401 에러 및 토큰 갱신)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response, config } = error;

        if (response?.status === 401 && !config._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    config.headers.Authorization = `Bearer ${token}`;
                    return api(config);
                }).catch(err => Promise.reject(err));
            }

            config._retry = true;
            isRefreshing = true;

            try {
                //  순수 axios 사용 (인터셉터 무한루프 방지)
                const res = await axios.get('/api/auth/refresh', { withCredentials: true });
                
                //  새 AccessToken 추출 (서버 응답 구조에 맞춰 'accessToken'으로 변경)
                const newToken = res.data.accessToken; 
                
                //  스토어에 새 토큰만 업데이트
                useAuthStore.getState().setToken(newToken); 
                
                processQueue(null, newToken);
                
                // 실패했던 기존 요청의 헤더를 교체하고 재시도
                config.headers.Authorization = `Bearer ${newToken}`;
                return api(config);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().clearAuth();
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;