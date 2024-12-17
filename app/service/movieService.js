import { movieRes } from "../models/Movie/movieRes";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getMoviesAll = async (page = 1, size = 20) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies`, {
            params: {
                page, 
                size,    
            },
        });

        if (response.data && Array.isArray(response.data.content)) {
            return {
                content: response.data.content.map((movie) => new movieRes(
                    movie.idmovie,
                    movie.title,
                    movie.overview,
                    movie.release_date,
                    movie.poster_path,
                    movie.background_path,
                    movie.rating,
                    movie.genres,
                )),
                totalPages: response.data.totalPages  
            };
        }

        throw new Error('Invalid response structure');
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
};

// export const getAllMovies = async () => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/movies`)

//         return response.data.map(
//             (movie) =>
//                 new movieRes(
//                     movie.idmovie,
//                     movie.title,
//                     movie.overview,
//                     movie.release_date,
//                     movie.poster_path,
//                     movie.background_path,
//                     movie.rating,
//                     movie.genres
//                 )
//         );
//     } catch (error) {
//         console.error("Failed to fetching all movies: ", error);
//         throw error;
//     }
// };

export const getMovieById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch movie details: ", error);
        throw error;
    }
};

export const searchMovieByName = async (req) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/movies/searchName`, req);
        return response.data;
    } catch (error) {
        console.error("Error searching movies:", error);
        throw error;
    }
};

export const getMoviesByGenre = async (genre) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/genre`, {
            params: { genre },  
        });

        const movies = response.data.map(
            (movie) => new movieRes(
                movie.idmovie,
                movie.title,
                movie.overview,
                movie.release_date,
                movie.poster_path,
                movie.background_path,
                movie.rating,
                movie.genres
            )
        );
        
        return movies;
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        throw error;
    }
};

export const getMoviesAllGenre = async (genre, page = 0, size = 20) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/Allgenre`, {
            params: { 
                genre,
                page,
                size
             },  
        });

        if (response.data && Array.isArray(response.data.content)) {
            return {
                content: response.data.content.map((movie) => new movieRes(
                    movie.idmovie,
                    movie.title,
                    movie.overview,
                    movie.release_date,
                    movie.poster_path,
                    movie.background_path,
                    movie.rating,
                    movie.genres,
                )),
                totalPages: response.data.totalPages  
            };
        }
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        throw error;
    }
};


