"use client";

import React, { useEffect, useState } from "react";
import { getMovieById } from "../../../service/movieService";
import { useParams } from "react-router";
import { movieRes } from "../../../models/Movie/movieRes";

const MovieDetail = () => {
    const { name, id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await getMovieById(id);
                const movieInstance = new movieRes(
                    data.idmovie,
                    data.title,
                    data.overview,
                    data.release_date,
                    data.poster_path,
                    data.background_path,
                    data.rating,
                    data.genres
                );
                setMovie(movieInstance);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch movie details");
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const formatThaiDate = (dateString) => {
        const months = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return <h2 className="text-center text-red-500 mt-10">{error}</h2>;
    }

    return (
        <div className="bg-gray-100 min-h-screen w-full">
            <div
                className="relative bg-cover bg-center h-[300px] md:h-[400px] lg:h-[600px]"
                style={{
                    backgroundImage: `url(${movie.getBackdropUrl()})`,
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex flex-col justify-end px-8 py-6 mt-8 mb-8 ml-12 text-white">
                    <h1 className="text-2xl md:text-4xl font-bold">{movie.title}</h1>
                    <p className="text-sm md:text-lg mt-2">
                        หมวดหมู่: {" "}
                        <span className="font-medium">{movie.getGenreNames()}</span>
                        <span className="ml-4 mr-4">|</span>
                        เรทคะแนน: {" "}
                        <span className="font-medium">{movie.rating ? parseFloat(movie.rating).toFixed(1) : "ไม่ระบุ"}</span>
                        <span className="ml-4 mr-4">|</span>
                        วันที่เข้าฉาย : {" "}
                        <span className="font-medium">{movie.release_date ? formatThaiDate(movie.release_date) : "ไม่ระบุ"}</span>
                    </p>

                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-16 p-6 bg-white shadow-md rounded-lg">
                <div className="flex flex-col md:flex-row mb-8">

                    <div className="w-full md:w-1/3 mt-8 md:mb-0 flex justify-center">
                        <img
                            src={movie.getPosterUrl()}
                            alt={movie.title}
                            className="w-full max-w-[300px] h-auto rounded-lg"
                        />
                    </div>

                    <div className="md:w-2/3 md:ml-12">
                        <h1 className="text-lg md:text-2xl font-bold mt-12 mb-6">{movie.title}</h1>
                        <p className="text-sm md:text-base text-gray-500 mt-2">
                            วันที่ฉาย: {movie.release_date ? formatThaiDate(movie.release_date) : "ไม่ระบุ"}
                        </p>
                        <p className="text-sm md:text-base text-gray-500 mt-2">
                            เรทคะแนน: {movie.rating ? parseFloat(movie.rating).toFixed(1) : "ไม่ระบุ"}
                        </p>

                        <div className="flex space-x-2 mt-4">
                            <button className="p-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600">
                                <i className="fas fa-list"></i>
                            </button>
                            <button className="p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600">
                                <i className="fas fa-heart"></i>
                            </button>
                            <button className="p-2 bg-yellow-500 text-white rounded-full shadow hover:bg-yellow-600">
                                <i className="fas fa-bookmark"></i>
                            </button>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-base md:text-lg font-bold">Overview</h3>
                            <p className="text-sm md:text-base mt-4 text-gray-700 text-justify">
                                {movie.overview || "ยังไม่มีข้อมูลในระบบ"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 p-6"></div>
        </div>
    );
};

export default MovieDetail;
