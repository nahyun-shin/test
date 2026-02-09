import React from 'react';
import api from '../axiosApi';

export const loginApi = {
    /**
     * 회원가입 api
     * @param {Object} formData - { username, name, password, confirmPassword }
     */
    signup: async(formData)=>{
        const response = await api.post(`/auth/signup`, formData);
        return response;
    },
    /**
     * 로그인 api
     * @param {*} formData - { username, password}
     */
    signin: async(formData)=>{
        const response = await api.post(`/auth/signin`, formData);
        return response.data;
    }
};