import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { boardApi } from '../../api/board/boardApi';
import { useBoard } from '../../hooks/useBoard';

function BoardForm() {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!boardId;
    const { createBoardMutation, updateBoardMutation } = useBoard();

    // 1. react-hook-form 초기화
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            content: '',
            category: '',
            file: null
        }
    });

    // 2. 카테고리 목록 조회
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => boardApi.getCategories(),
    });
    const categoryList = categories?.data ? Object.entries(categories.data) : [];

    // 3. 수정 모드일 경우 기존 데이터 세팅
    const { data: existingData, isLoading: isDetailLoading } = useQuery({
        queryKey: ['board', boardId],
        queryFn: () => boardApi.getBoardDetail(boardId),
        enabled: isEditMode,
    });

    useEffect(() => {
        if (isEditMode && existingData?.data) {
            reset({
                title: existingData.data.title,
                content: existingData.data.content,
                category: existingData.data.category,
                file: null // 파일은 보안상 기존 값을 input에 채울 수 없습니다.
            });
        }
    }, [isEditMode, existingData, reset]);

    // 4. 폼 제출 핸들러
    const onSubmit = async (data) => {
        // useBoard의 mutation에서 FormData 변환 로직을 처리하도록 설계되어 있다면 data만 넘깁니다.
        // 만약 useBoard를 제가 드린 가이드대로 수정하셨다면 아래와 같이 호출합니다.
        if (isEditMode) {
            updateBoardMutation.mutate({ boardId, ...data },
                {
                    onSuccess: () => {
                        navigate(`/boards/${boardId}`, { replace: true });
                    }
                }
            );
        } else {
            createBoardMutation.mutate(data,
                {
                    onSuccess: () => {
                        navigate(`/boards`, { replace: true });
                    }
                }
            );
        }
    };

    if (isEditMode && isDetailLoading) return <div className="text-center py-20">데이터를 불러오는 중...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-100 mt-10">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-4">
                {isEditMode ? '게시글 수정' : '글 작성'}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 카테고리 선택 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">카테고리</label>
                    <select 
                        {...register('category', { required: "카테고리를 선택해주세요." })}
                        className={`w-full border p-3 rounded-lg outline-none transition-all ${errors.category ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                    >
                        <option value="">카테고리를 선택하세요</option>
                        {categoryList.map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>

                {/* 제목 입력 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                    <input 
                        {...register('title', { required: "제목을 입력해주세요." })}
                        type="text" 
                        placeholder="제목을 입력하세요"
                        className={`w-full border p-3 rounded-lg outline-none transition-all ${errors.title ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* 내용 입력 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                    <textarea 
                        {...register('content', { required: "내용을 입력해주세요." })}
                        placeholder="내용을 입력하세요"
                        className={`w-full border p-3 rounded-lg h-64 outline-none transition-all resize-none ${errors.content ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                    />
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
                </div>

                {/* 파일 업로드 */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        첨부파일 {isEditMode && <span className="text-blue-500 font-normal ml-2">(새 파일을 선택하지 않으면 기존 파일이 유지됩니다)</span>}
                    </label>
                    <input 
                        {...register('file')}
                        type="file" 
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                    />
                </div>

                {/* 버튼 그룹 */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)} 
                        className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    >
                        취소
                    </button>
                    <button 
                        type="submit" 
                        disabled={createBoardMutation.isPending || updateBoardMutation.isPending}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95 disabled:bg-blue-300"
                    >
                        {createBoardMutation.isPending || updateBoardMutation.isPending ? '처리 중...' : (isEditMode ? '수정 완료' : '게시글 등록')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BoardForm;