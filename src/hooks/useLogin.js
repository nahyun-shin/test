import { useNavigate } from "react-router";
import { jwtDecode } from 'jwt-decode';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "../api/login/loginApi";
import { useAuthStore } from "../pages/store/authStore";

export const useLogin =()=>{
    const setLogin = useAuthStore((state) => state.setLogin);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const signupMutation = useMutation({
        mutationFn: async(formData) =>{
            const response = await loginApi.signup(formData);
            return response;
        },
        onSuccess : (data) =>{
            console.log(data);
        },
        onError : (error) =>{
            console.error('회원가입 실패', error);
            alert("회원가입에 실패하였습니다. 다시 가입해주세요.");
        }
    });

    const signinMutation = useMutation({
        mutationFn: async(formData) =>{
            const response = await loginApi.signin(formData);
            return response;
        },
        onSuccess : (data) =>{
            console.log(data);
            const { accessToken } = data;

            // 토큰 해독하여 payload에서 정보 추출
            const decoded = jwtDecode(accessToken);

            // 스토어에 저장
            setLogin({
                accessToken: accessToken,
                username: decoded.username, 
                name: decoded.name,
            });

            alert(`${decoded.name}님, 환영합니다!`);
            queryClient.invalidateQueries({ queryKey: ['board'] }); 
            queryClient.invalidateQueries({ queryKey: ['boardDetail'] });
            navigate('/');
        },
        onError : (error) =>{
            console.error('로그인 실패', error);
            alert("로그인에 실패하였습니다. 다시 로그인해주세요.");
        }
    });

    return{signupMutation, signinMutation};
}