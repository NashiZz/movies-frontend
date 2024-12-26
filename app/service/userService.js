import axios from "axios";
import { userRes } from "../models/Users/userRes";

const API_BASE_URL = "http://localhost:8080/api";

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/all`)
       
        return response.data.map(
            (user) =>
                new userRes(
                    user.uid,
                    user.username,
                    user.name,
                    user.lastname,
                    user.address,
                    user.email,
                    user.password,
                    user.img_profile
                )
        );
    } catch (error) {
        console.error("Failed to fetching all Users: ", error);
        throw error;
    }
};

export const getUserProfile = async (usernameOrEmail) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/profile`, {
            params: { usernameOrEmail }, 
        });
        return new userRes(
            response.data.uid,
            response.data.username,
            response.data.name,
            response.data.lastname,
            response.data.address,
            response.data.email,
            response.data.password,
            response.data.img_profile
        );
    } catch (error) {
        console.error("Failed to fetch user profile: ", error);
        throw error; 
    }
};

export const RegisterUsers = async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user/register`, userData);
            return response.data; 
        } catch (error) {
            console.error("Error during registration:", error);
            throw error; 
        }
};

export const loginUser = async (usernameOrEmail, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/login`, { 
            usernameOrEmail,
            password
        });
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error; 
    }
};