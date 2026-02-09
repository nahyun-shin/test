import api from "../axiosApi"

export const boardApi={
    
    createBoard: async (data) => {
        const formData = new FormData();

        // 1. JSON 데이터를 객체로 준비
        const requestDto = {
            title: data.title,
            content: data.content,
            category: data.category,
        };
        
        // 2. 핵심: JSON 객체를 Blob으로 만들고, 명시적으로 type을 설정합니다.
        // curl의 ";type=application/json" 부분을 재현하는 핵심 로직입니다.
        const jsonBlob = new Blob([JSON.stringify(requestDto)], {
            type: 'application/json',
        });
        
        // 3. 'request'라는 이름으로 Blob 추가
        formData.append('request', jsonBlob);

        // 4. 파일 추가 ('file'이라는 이름으로 파일 객체 추가)
        if (data.file && data.file[0]) {
            formData.append('file', data.file[0]);
        }

        const response = await api.post('/boards', formData, {
            headers: {
                // Axios에서 multipart/form-data를 보낼 때는 헤더를 비워두거나 
                // 아래와 같이 설정하면 브라우저가 자동으로 boundary를 생성합니다.
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response;
    },
    updateBoard: async (id, data) => {
        const formData = new FormData();

        // 1. JSON 데이터 처리 (Blob 필수)
        const requestBlob = new Blob([JSON.stringify({
            title: data.title,
            content: data.content,
            category: data.category
        })], { type: 'application/json' });
        
        formData.append('request', requestBlob);

        // 2. 파일 처리: 파일이 새로 선택된 경우에만 append
        // data.file이 FileList 형태일 때 첫 번째 파일이 있는지 확인
        if (data.file && data.file.length > 0) {
            formData.append('file', data.file[0]);
        } 
        // else { 
        //   이 부분에서 아무것도 append 하지 않으면 서버는 기존 파일을 유지합니다.
        // }

        // 3. PATCH 요청
        const response = await api.patch(`/boards/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    
    getCategories: async()=>{
        const response = await api.get(
            `/boards/categories`
        )
        return response;
    },

    getBoardList: async({ page = 0, size = 10, category = '' })=>{
        const response = await api.get('/boards', {
            params: {
                page,
                size,
                ...(category && { category })
            }
        });
        return response;
    },

    getBoardDetail: async(boardId)=>{
        const response = await api.get(
            `/boards/${boardId}`
        )
        return response;
    },

    deleteBoard: async (boardId) => {
        const response = await api.delete(`/boards/${boardId}`);
        return response.data;
    }

}