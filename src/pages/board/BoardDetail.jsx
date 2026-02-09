import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { boardApi } from '../../api/board/boardApi';
import { useAuthStore } from '../store/authStore';
import { useShallow } from 'zustand/react/shallow';
import { useBoard } from '../../hooks/useBoard';
import { Download, Image as ImageIcon, Link as LinkIcon, ExternalLink } from 'lucide-react'; 

function BoardDetail() {
    const { boardId } = useParams();
    const { deleteBoardMutation } = useBoard();
    const navigate = useNavigate();

    const { isLogin } = useAuthStore(
        useShallow((state) => ({
            isLogin: state.isAuthenticated(),
        }))
    );

    const { data: board, isLoading, isError } = useQuery({
        queryKey: ['boardDetail', boardId],
        queryFn: () => boardApi.getBoardDetail(boardId),
        enabled: !!boardId,
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (isError || !board?.data) return (
        <div className="text-center py-20 font-sans">
            <p className="text-gray-500 text-lg">게시글을 찾을 수 없습니다.</p>
            <button onClick={() => navigate('/boards')} className="mt-4 text-blue-600 underline">목록으로 돌아가기</button>
        </div>
    );

    const post = board.data;
    
    // 서버 도메인 설정 (이미지 주소 조립용)
    const BASE_URL = "https://front-mission.bigs.or.kr";
    // 실제 사용될 이미지 풀 경로
    const fullImageUrl = post.imageUrl ? `${BASE_URL}${post.imageUrl}` : null;

    // URL에서 파일명만 추출하는 함수
    const getFileName = (url) => {
        if (!url) return "";
        return url.split('/').pop();
    };

    const handleDelete = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            deleteBoardMutation.mutate(boardId, {
                onSuccess: () => {
                    alert('삭제되었습니다.');
                    navigate('/boards', { replace: true });
                }
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-sm rounded-xl mt-10 border border-gray-100 mb-20">
            {/* 상단 헤더 */}
            <div className="border-b border-gray-100 pb-6 mb-8">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase mb-4 inline-block">
                    {/* 데이터 필드명 boardCategory로 변경 */}
                    {post.boardCategory}
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {post.title}
                </h1>
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-700">{post.authorName || '익명'}</span>
                        <span className="text-gray-300">|</span>
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            {/* 본문 내용 */}
            <div className="min-h-[200px] py-4 text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                {post.content}
            </div>

            {/* --- 수정된 첨부 파일 영역 --- */}
            {fullImageUrl && (
                <div className="mt-12 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <LinkIcon size={18} className="text-blue-600" /> 첨부 이미지
                    </h3>
                    
                    {/* 1. 이미지 미리보기 */}
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group relative shadow-inner">
                        <img 
                            src={fullImageUrl} 
                            alt="첨부 이미지" 
                            className="max-w-full h-auto mx-auto object-contain max-h-[600px] transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                            <a 
                                href={fullImageUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2 backdrop-blur-sm transition-all"
                            >
                                <ExternalLink size={14} /> 크게 보기
                            </a>
                        </div>
                    </div>

                    {/* 2. 다운로드/정보 카드 */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                <ImageIcon className="text-blue-500" size={24} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px] md:max-w-md">
                                    {getFileName(post.imageUrl)}
                                </p>
                                <p className="text-xs text-gray-400">이미지 파일</p>
                            </div>
                        </div>
                        <a 
                            href={fullImageUrl} 
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                        >
                            <Download size={16} /> 다운로드
                        </a>
                    </div>
                </div>
            )}

            {/* 하단 버튼 그룹 */}
            <div className="flex justify-between items-center mt-16 pt-6 border-t border-gray-100">
                <button 
                    onClick={() => navigate('/boards')} 
                    className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-all"
                >
                    목록으로
                </button>
                
                <div className="flex gap-2">
                    {isLogin && (
                        <>
                            <button 
                                onClick={() => navigate(`/boards/${boardId}/update`)} 
                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                            >
                                수정
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-all"
                                disabled={deleteBoardMutation.isPending}
                            >
                                {deleteBoardMutation.isPending ? '삭제 중...' : '삭제'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BoardDetail;