import React from 'react';
import * as yup from "yup";
import { Link, useNavigate } from 'react-router';
import { useLogin } from '../../hooks/useLogin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputForm from '../../components/InputForm';

const signinFields = [
  { label: "이메일", name: "username", type: "text", placeholder: "example@email.com" },
  { label: "비밀번호", name: "password", type: "password", placeholder: "••••••••" },
];

function SignIn(props) {
    const navigate = useNavigate();
    const { signinMutation } = useLogin();
    const schema = yup.object().shape({
        username: yup
            .string()
            .trim()
            .required("이메일을 입력하십시오.")
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "올바른 이메일 형식이 아닙니다. (예: user@example.com)"
            ),
        password: yup
            .string()
            .required("비밀번호를 입력하십시오")
            .min(8, "비밀번호는 최소 8자리 이상이어야 합니다")
            .matches(/[A-Za-z]/, "영문자를 포함해야 합니다")
            .matches(/\d/, "숫자를 포함해야 합니다")
            .matches(/[!%*#?&]/, "특수문자(!%*#?&)를 포함해야 합니다"),
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
        await signinMutation.mutateAsync(data);
        reset();
    };
    return (
        <>
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
            <p className="text-sm text-gray-500 mt-1">서비스 이용을 위해 계정 정보를 입력하세요.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {
                signinFields.map((field)=>(
                    <InputForm
                        key={field.name}
                        {...field}
                        register={register}
                        error={errors[field.name]}
                    />
                ))
            }

            <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all active:scale-[0.98]">
            로그인
            </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
            아직 회원이 아니신가요? 
            <Link to="/login/signUp" className="ml-2 font-bold text-blue-600 hover:text-blue-500 underline-offset-4 hover:underline">
                회원가입
            </Link>
            </p>
        </div>
        </>
    );
}

export default SignIn;