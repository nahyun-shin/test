import { useMutation, useQueryClient } from '@tanstack/react-query';
import { boardApi } from '../api/board/boardApi';

export const useBoard = () => {
    const queryClient = useQueryClient();

    // 1. 게시글 등록
    const createBoardMutation = useMutation({
        mutationFn: async (data) => {
            return await boardApi.createBoard(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board'] });
            alert("게시글이 성공적으로 등록되었습니다.");
        },
        onError: (error) => {
            console.error('게시글 등록 실패', error);
            alert("게시글 등록에 실패하였습니다.");
        }
    });

    // 2. 게시글 수정
    const updateBoardMutation = useMutation({
        mutationFn: async ({ boardId, ...data }) => {
            // 여기서 data는 title, content, category, file을 포함한 객체입니다.
            return await boardApi.updateBoard(boardId, data);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['board'] });
            queryClient.invalidateQueries({ queryKey: ['board', variables.boardId] });
            alert("게시글이 성공적으로 수정되었습니다.");
        },
        onError: (error) => {
            console.error('게시글 수정 실패', error);
            const message = error.response?.data?.message || "게시글 수정에 실패하였습니다.";
            alert(message);
        }
    });

    const deleteBoardMutation = useMutation({
        mutationFn: (boardId) => boardApi.deleteBoard(boardId),
        onSuccess: () => {
            // 목록 데이터 캐시 삭제
            queryClient.invalidateQueries({ queryKey: ['board'] });
            alert("게시글이 성공적으로 삭제되었습니다.");
        },
        onError: (error) => {
            console.error('삭제 실패:', error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    });

    return { createBoardMutation, updateBoardMutation, deleteBoardMutation };
};