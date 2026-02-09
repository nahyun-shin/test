import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import Layout from '../pages/store/Layout';
import LoginLayout from '../components/login/LoginLayout';
import Login from '../pages/login/SignIn';
import SignUp from '../pages/login/SignUp';
import AuthGuard from './AuthGuard';
import Board from '../pages/board/Board';
import BoardForm from '../pages/board/BoardForm';
import BoardDetail from '../pages/board/BoardDetail';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
        {
            index: true,
            // 첫 진입 시 AuthGuard를 거쳐 적절한 곳으로 리다이렉트
            element: <AuthGuard requireAuth={true}><Navigate to="/boards" replace /></AuthGuard>
        },
        {
            path: "boards",
            element: (
                <AuthGuard requireAuth={true}>
                    <Outlet /> 
                </AuthGuard>
            ),
            children: [
                { 
                    index: true, // /board 접속 시
                    element: <Board /> 
                },
                { 
                    path: ":boardId", // /board 접속 시
                    element: <BoardDetail /> 
                },
                { 
                    path: "write", // /board/write 접속 시
                    element: <BoardForm type="write" /> 
                },
                { 
                    path: ":boardId/update", // /board/1/update 접속 시
                    element: <BoardForm type="update" /> 
                },
            ]
        },
        {
            path: "login",
            element: (
                <AuthGuard requireAuth={false}>
                    <LoginLayout />
                </AuthGuard>
            ),
            children: [
                { index: true, element: <Login /> },
                { path: "signUp", element: <SignUp /> },
            ],
        },
        ]
    }
]);

export default router;