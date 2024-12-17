
import React, { useEffect, useState, useRef } from "react";
import { getMoviesByGenre } from "../../../service/movieService";
import MovieCard from "./MovieCard";
import { getAllGenres } from "../../../service/genreService";

const MovieAll = () => {
    const [genres, setGenres] = useState([]);
    const [moviesByGenre, setMoviesByGenre] = useState({});
    const [loading, setLoading] = useState(true);

    const movieContainerRefs = useRef({});

    useEffect(() => {
        const fetchGenresAndMovies = async () => {
            try {
                const genresData = await getAllGenres();
                setGenres(genresData);

                const moviesData = {};
                for (let genre of genresData) {
                    const movies = await getMoviesByGenre(genre.name);
                    moviesData[genre.name] = movies;
                }
                setMoviesByGenre(moviesData);
            } catch (error) {
                console.error("Error loading genres and movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenresAndMovies();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="px-6 md:px-12 lg:px-24 py-6 mx-2 md:mx-16">
            {genres.map((genre) => (
                <div key={genre.idgen} className="mb-8 mt-10">
                    <h2 className="text-2xl md:text-3xl text-purple-600 font-bold mb-4 relative">
                        <span className="mr-4">|</span>
                        {genre.name}
                    </h2>

                    <div className="w-full flex mt-6">
                        <hr className="border-t-2 text-teal-500 w-full" />
                    </div>

                    {moviesByGenre[genre.name]?.length > 0 ? (
                        <div className="relative">
                            <div
                                ref={(el) => (movieContainerRefs.current[genre.name] = el)}
                                className="flex overflow-x-auto gap-6 movie-container overflow-y-hidden"
                            >
                                {moviesByGenre[genre.name]?.map((movie) => (
                                    <MovieCard key={movie.idmovie} movie={movie} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4">ไม่มีภาพยนต์ในหมวดหมู่นี้</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MovieAll;
