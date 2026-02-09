import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuthStore } from '../pages/store/authStore';
import { useShallow } from 'zustand/react/shallow';

function Header(props) {
    const [isOpen, setIsOpen] = useState(false);
    const { username, name, isLogin, clearAuth } = useAuthStore(
        useShallow((state) => ({
            username: state.username,
            name: state.name,
            isLogin: state.isAuthenticated(),
            clearAuth: state.clearAuth,
        }))
    );

    // 메뉴 클릭 시 모바일 메뉴를 닫아주는 함수 (사용성 개선)
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    
                    {/* 1. 로고 영역: 클릭 시 홈으로 이동 */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/boards" className="text-2xl font-bold text-blue-600 cursor-pointer">
                            mission
                        </Link>
                    </div>

                    {/* 2. 데스크탑 메뉴 */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/boards" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                            게시판
                        </Link>
                        {
                            isLogin ?(
                                <>
                                    <span>{name}({username})님</span>
                                    <button className="bg-red-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-700 transition-all shadow-md active:scale-95" onClick={clearAuth}>로그아웃</button>
                                </>
                            ):(
                                <Link to="/login">
                                    <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95">
                                        로그인
                                    </button>
                                </Link>
                            )
                        }
                    </div>

                    {/* 3. 모바일 햄버거 버튼 */}
                    <div className="md:hidden flex items-center">
                        <span className='mr-5'>{name}님</span>
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-blue-600 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. 모바일 드롭다운 메뉴 */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-100`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link 
                        to="/boards" 
                        onClick={closeMenu} // 이동 후 메뉴 닫기
                        className="block px-3 py-2 rounded-md text-base font-medium text-center text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                        게시판
                    </Link>
                    {
                        isLogin ?(
                                <>
                                    <button className="w-full px-3 py-2 rounded-md text-base font-medium text-center text-white bg-red-600 hover:bg-red-700 mt-2 transition-colors" onClick={clearAuth}>로그아웃</button>
                                </>
                            ):(
                                <Link to="/login" onClick={closeMenu}>
                                    <button className="w-full px-3 py-2 rounded-md text-base font-medium text-center text-white bg-blue-600 hover:bg-blue-700 mt-2 transition-colors">
                                        로그인
                                    </button>
                                </Link>
                            )
                    }
                </div>
            </div>
        </nav>
    );
}

export default Header;