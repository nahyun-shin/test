import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { boardApi } from '../../api/board/boardApi';
import Pagination from '../../components/Pagination';
import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '../store/authStore';

function Board() {
    const isLogin = useAuthStore((state) => state.accessToken);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    // URL에서 현재 페이지와 카테고리 추출
    const currentPage = parseInt(queryParams.get('page') ?? '0', 10);
    const currentCategory = queryParams.get('category') ?? '';

    // 1. 카테고리 목록 조회
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => boardApi.getCategories(),
    });

    // 2. 게시글 목록 조회 (쿼리 키에 페이지와 카테고리를 포함시켜 변경될 때마다 자동 실행)
    const { data: board, isLoading } = useQuery({
        queryKey: ['board', currentPage, currentCategory],
        queryFn: () => boardApi.getBoardList({
            page: currentPage,
            size: 10,
            category: currentCategory // 서버가 지원한다면 서버 필터링 수행
        }),
    });

    const categoryList = categories?.data ? Object.entries(categories.data) : [];
    const allPosts = board?.data?.content ?? [];
    const totalRows = board?.data?.totalElements ?? 0;

    // useEffect(()=>{
    //     console.log(allPosts)
    // },[allPosts]);

    // 서버가 category 파라미터를 무시하고 전체를 줄 경우를 대비한 방어 코드입니다.
    const displayList = currentCategory === '' 
        ? allPosts 
        : allPosts.filter(post => post.category === currentCategory);

    // 필터 및 페이지 이동 처리
    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(location.search);
        
        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        // 카테고리를 바꿀 때는 데이터 혼선을 막기 위해 페이지를 0으로 리셋합니다.
        if (key === 'category') {
            params.set('page', '0');
        }
        
        navigate(`${location.pathname}?${params.toString()}`);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">게시판</h1>
                
                {/* 카테고리 필터링 Selectbox */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">분류:</span>
                    <select 
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
                        value={currentCategory}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">전체보기</option>
                        {categoryList.map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 게시글 테이블 카드 */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-20 text-center">No.</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">카테고리</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">제목</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-40 text-center">작성일</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-400 font-medium">데이터를 가져오고 있습니다...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : displayList.length > 0 ? (
                            displayList.map((brd) => (
                                <tr 
                                    key={brd.id} 
                                    className="hover:bg-blue-50/50 cursor-pointer transition-all group"
                                    onClick={() => navigate(`/boards/${brd.id}`)}
                                >
                                    <td className="px-6 py-4 text-sm text-gray-400 text-center font-mono">{brd.id}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase">
                                            {brd.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {brd.title}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 text-center">
                                        {new Date(brd.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-20 text-center text-gray-400 font-medium">
                                    등록된 게시글이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 하단 페이지네이션 및 작성 버튼 */}
            <div className="mt-10 flex flex-col items-center relative">
                <Pagination 
                    page={currentPage} 
                    totalRows={totalRows} 
                    pagePerRows={10} 
                    movePage={(page) => handleFilterChange('page', page)} 
                />
                
                <div className="absolute right-0 top-0">
                    {isLogin ? (
                        <button 
                            onClick={() => navigate('/boards/write')}
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all"
                        >
                            글 작성
                        </button>
                    ) : (
                        <p className="text-sm text-gray-500 italic">* 글을 작성하려면 로그인이 필요합니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Board;