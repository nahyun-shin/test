import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from 'react-router';
import * as yup from "yup";
import { useLogin } from '../../hooks/useLogin';
import InputForm from '../../components/InputForm';

const signupFields = [
    { label: "이름", name: "name", type: "text", placeholder: "홍길동" },
    { label: "이메일", name: "username", type: "text", placeholder: "example@email.com" },
    { label: "비밀번호", name: "password", type: "password", placeholder: "영문, 숫자, 특수문자를 포함한 8자리 이상" },
    { label: "비밀번호 확인", name: "confirmPassword", type: "password", placeholder: "비밀번호 확인" },
];

function SignUp(props) {
    const navigate = useNavigate();
    const { signupMutation } = useLogin();
    const schema = yup.object().shape({
        username: yup
            .string()
            .trim()
            .required("이메일을 입력하십시오.")
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "올바른 이메일 형식이 아닙니다. (예: user@example.com)"
            ),
        name: yup
            .string()
            .required("이름을 입력하십시오"),
        password: yup
            .string()
            .required("비밀번호를 입력하십시오")
            .min(8, "비밀번호는 최소 8자리 이상이어야 합니다")
            .matches(/[A-Za-z]/, "영문자를 포함해야 합니다")
            .matches(/\d/, "숫자를 포함해야 합니다")
            .matches(/[!%*#?&]/, "특수문자(!%*#?&)를 포함해야 합니다"),
        confirmPassword: yup
            .string()
            .required("비밀번호를 입력하십시오")
            .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다"),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });

    const onSubmit = async (data) => {
        // console.log("폼 데이터:", data);        
        await signupMutation.mutateAsync(data);
        reset();
        alert("회원가입이 완료되었습니다.");
        navigate('/login');
    };
    return (
        <>
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
            <p className="text-sm text-gray-500 mt-1">간편하게 가입하고 서비스를 시작해보세요.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {signupFields.map((field)=>(
                <InputForm
                    id={field.name}
                    key={field.name}
                    {...field}
                    register={register}
                    error={errors[field.name]}
                />
            ))}

            <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black transition-all active:scale-[0.98]">
            가입하기
            </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
            이미 계정이 있으신가요? 
            <Link to="/login" className="ml-2 font-bold text-blue-600 hover:text-blue-500 underline-offset-4 hover:underline">
                로그인으로 돌아가기
            </Link>
            </p>
        </div>
        </>
    );
}

export default SignUp;