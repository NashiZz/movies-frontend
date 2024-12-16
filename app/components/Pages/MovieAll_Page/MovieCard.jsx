import React from "react";
import { Link } from "react-router";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/movies/${movie.title}/${movie.idmovie}`} key={movie.idmovie}>
            <div className="bg-white mt-6 mb-6 shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 w-[200px] h-[480px] flex flex-col hover:bg-gray-200 active:bg-gray-300">
                <div className="w-full">
                    <img
                        src={movie.getPosterUrl()}
                        alt={movie.title}
                        className="max-w-full max-h-full object-contain transition duration-300"
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
    );
};

export default MovieCard;
