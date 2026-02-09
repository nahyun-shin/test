import React from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '../pages/store/authStore';

const AuthGuard = ({ children, requireAuth }) => {
    const token = useAuthStore((state) => state.accessToken);

    // 1. 인증이 필요한데 토큰이 없는 경우 -> 로그인 페이지로
    if (requireAuth && !token) {
        return <Navigate to="/login" replace />;
    }

    // 2. 이미 로그인했는데 로그인/회원가입 페이지에 접근하는 경우 -> 메인으로
    if (!requireAuth && token) {
        return <Navigate to="/boards" replace />;
    }

    // 3. 그 외에는 정상적으로 자식 컴포넌트 보여줌
    return children;
};

export default AuthGuard;