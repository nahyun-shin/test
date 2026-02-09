import React from 'react';
import { Link, Outlet } from 'react-router';

function LoginLayout(props) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* 공통 로고 영역 */}
            <Link to="/boards" className="flex justify-center">
            <span className="text-3xl font-black text-blue-600">mission</span>
            </Link>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
            {/* 여기가 Login 또는 SignUp 컴포넌트가 렌더링되는 지점 */}
            <Outlet />
            </div>
        </div>
        </div>
    );
}

export default LoginLayout;