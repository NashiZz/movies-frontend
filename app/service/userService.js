import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

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