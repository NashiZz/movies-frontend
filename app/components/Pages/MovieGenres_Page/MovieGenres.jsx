
import { useState, useEffect } from "react";
import { getMoviesAllGenre, getMoviesByGenre } from "../../../service/movieService";
import { Link, useParams } from "react-router-dom";
import {
    faStar
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MovieGenres = () => {
    const { genreName } = useParams();
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMovies = async (page) => {
        try {
            setLoading(true);
            const data = await getMoviesAllGenre(genreName, page, 50);
            setMovies(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (genreName) {
            fetchMovies(currentPage);
        } else {
            setLoading(false);
            setError("ไม่มีหมวดหมู่ที่เลือก");
        }
    }, [genreName, currentPage]);

    const loadNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const loadPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

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
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 md:px-10 justify-items-center">
                            {movies.map((movie) => (
                                <Link to={`/movies/${movie.title}/${movie.idmovie}`} key={movie.idmovie}>
                                    <div className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 w-full max-w-[200px] h-[450px] flex flex-col">
                                        <div className="w-full h-[300px] flex items-center justify-center bg-gray-100">
                                            <img
                                                src={movie.getPosterUrl()}
                                                alt={movie.title}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>

                                        <div className="p-4 flex flex-col justify-between flex-grow">
                                            <p className="text-sm text-gray-600 flex items-center">
                                                <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-yellow-400 mr-1" />
                                                {movie.rating ? parseFloat(movie.rating).toFixed(1) : "ไม่ระบุ"}
                                            </p>
                                            <h2 className="text-sm font-semibold mt-2 line-clamp-2">
                                                {movie.title}
                                            </h2>
                                            <p className="text-xs text-blue-500 mt-2">
                                                วันที่ฉาย: {movie.release_date}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-10 flex-wrap gap-4 sm:gap-6">
                            <button
                                onClick={loadPreviousPage}
                                disabled={currentPage === 0}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 transition-all w-full sm:w-auto text-center"
                            >
                                หน้าก่อนหน้า
                            </button>

                            <div className="flex items-center justify-center space-x-2 sm:space-x-4 flex-wrap">
                                <p className="text-lg font-semibold text-gray-700 hidden sm:block">หน้า</p>
                                {currentPage > 2 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentPage(0)}
                                            className="px-3 py-1 text-sm font-semibold rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            1
                                        </button>
                                        {currentPage > 3 && <span className="text-gray-500">...</span>}
                                    </>
                                )}

                                {Array.from({ length: 5 }, (_, index) => {
                                    const page = currentPage - 2 + index;
                                    if (page >= 0 && page < totalPages) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 text-sm font-semibold rounded-md ${currentPage === page
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                            >
                                                {page + 1}
                                            </button>
                                        );
                                    }
                                    return null;
                                })}

                                {currentPage < totalPages - 3 && (
                                    <>
                                        {currentPage < totalPages - 4 && <span className="text-gray-500">...</span>}
                                        <button
                                            onClick={() => setCurrentPage(totalPages - 1)}
                                            className="px-3 py-1 text-sm font-semibold rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                                <p className="text-lg font-semibold text-gray-700 hidden sm:block">
                                    จาก {totalPages}
                                </p>
                            </div>

                            <button
                                onClick={loadNextPage}
                                disabled={currentPage === totalPages - 1}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-all w-full sm:w-auto text-center"
                            >
                                หน้าถัดไป
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MovieGenres;
