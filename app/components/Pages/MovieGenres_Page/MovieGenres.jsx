"use client";

import { useEffect, useState } from "react";
import { getMoviesByGenre } from "../../../service/movieService";
import { Link, useParams } from "react-router-dom";
import {
    faStar
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MovieGenres = () => {
    const { genreName } = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getMoviesByGenre(genreName);
                setMovies(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (genreName) {
            fetchMovies();
        } else {
            setLoading(false);
            setError("ไม่มีหมวดหมู่ที่เลือก");
        }
    }, [genreName]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl md:text-3xl text-purple-600 font-bold ml-16 mb-8 mt-10 relative">
                    <span className="mr-4">|</span>
                    {genreName}
                </h2>
                <div className="w-full flex justify-center mb-10">
                    <hr className="border-t-2 text-teal-500 w-11/12" />
                </div>

                {movies.length === 0 ? (
                    <div className="relative w-full h-96 flex mb-8 mt-10 ml-14">
                        <p className="text-gray-500 ">ไม่มีภาพยนต์ในหมวดหมู่นี้</p>
                    </div>

                ) : (
                    <div className="grid grid-cols-1 mb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mx-20 justify-items-center">
                        {movies.map((movie) => (
                            <Link to={`/movies/${movie.title}/${movie.idmovie}`} key={movie.idmovie}>
                                <div className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 w-[200px] h-[480px] flex flex-col">
                                    <div className="w-full">
                                        <img
                                            src={movie.getPosterUrl()}
                                            alt={movie.title}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>

                                    <div className="p-4 mb-2 text-left flex-1 flex flex-col justify-between">
                                        <p className="text-lg text-gray-600 flex items-center">
                                            <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-yellow-400 mr-1" />
                                            {movie.rating ? parseFloat(movie.rating).toFixed(1) : "ไม่ระบุ"}
                                        </p>
                                        <h2 className="text-lg font-semibold line-clamp-2">
                                            {movie.title}
                                        </h2>
                                        <p className="text-sm text-blue-500 mb-2 mt-4">
                                            วันที่ฉาย: {movie.release_date}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieGenres;
