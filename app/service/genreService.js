import axios from "axios";
import { genreRes } from "../models/Genres/genreRes";

const API_BASE_URL = "http://localhost:8080/api";

export const getAllGenres= async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/genres`)
       
        return response.data.map(
            (genre) =>
                new genreRes(
                    genre.idgen,
                    genre.name
                )
        );
    } catch (error) {
        console.error("Failed to fetching all genres: ", error);
        throw error;
    }
};

export const searchGenreByName = async (req) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/genres/searchName`, req);
        return response.data;
    } catch (error) {
        console.error("Error searching genres:", error);
        throw error;
    }
};

export const searchMoviesByGenre = async (genre, page = 0, size = 50) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/genres/search`, {
            params: {
                genre: genre,
                page: page,
                size: size,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        throw error;
    }
};