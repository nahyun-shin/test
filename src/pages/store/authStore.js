import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const useAuthStore = create(
    persist(
        immer((set, get) => ({
        // --- 상태 (State) ---
        accessToken: null,
        username: null,
        name: null,

        // --- 기능 (Actions) ---
        
        // 💡 로그인 여부 확인 함수
        // 호출 시점의 accessToken 존재 여부를 boolean으로 반환합니다.
        isAuthenticated: () => !!get().accessToken,

        // 로그인 시 데이터 저장
        setLogin: (data) => {
            set((state) => {
            state.accessToken = data.accessToken;
            state.username = data.username;
            state.name = data.name;
            });
        },

        // 토큰만 갱신 (Refresh 시 사용)
        setToken: (token) => {
            set((state) => {
            state.accessToken = token;
            });
        },

        // 로그아웃 (모든 정보 삭제)
        clearAuth: () => {
            set((state) => {
            state.accessToken = null;
            state.username = null;
            state.name = null;
            });
        },
        })),
        {
        name: 'auth-info',
        storage: createJSONStorage(() => localStorage),
        }
    )
);