
import { useState, useEffect } from "react";
import { getMoviesAll } from "../../../service/movieService";
import { Link } from "react-router";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchMovies = async (page) => {
        try {
            setLoading(true);
            const data = await getMoviesAll(page);
            setMovies(data.content || []);
            setTotalPages(data.totalPages || 1);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch movies");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(currentPage);
    }, [currentPage]);

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

    if (error) {
        return (
            <h2 className="text-center text-red-500 mt-10">{error}</h2>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl md:text-3xl text-purple-600 font-bold ml-14 mb-8 mt-10 relative">
                <span className="mr-4">|</span> ภาพยนต์ทั้งหมด
            </h2>
            <div className="w-full flex justify-center mb-10">
                <hr className="border-t-2 text-teal-500 w-11/12" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mx-20 justify-items-center">
                {movies.map((movie) => (
                    <Link to={`/movies/${movie.title}/${movie.idmovie}`} key={movie.idmovie}>
                        <div className="bg-white mt-6 shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 w-[200px] h-[480px] flex flex-col">
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

            <div className="flex items-center justify-between mt-10 flex-wrap gap-4">
                <button
                    onClick={loadPreviousPage}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 transition-all w-full sm:w-auto"
                >
                    หน้าก่อนหน้า
                </button>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <p className="text-lg font-semibold text-gray-700">
                        หน้า
                    </p>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md ${currentPage === index
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <p className="text-lg font-semibold text-gray-700">
                        จาก {totalPages}
                    </p>
                </div>

                <button
                    onClick={loadNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-all w-full sm:w-auto"
                >
                    หน้าถัดไป
                </button>
            </div>

        </div>
    );
};

export default Home;
