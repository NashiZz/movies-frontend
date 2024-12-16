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