import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMoviesByGenre, searchMovieByName } from "@/app/service/movieService";
import { searchGenreByName, searchMoviesByGenre } from "@/app/service/genreService";

const SearchResults = () => {
    const { searchText } = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchMovies = async (pageNo) => {
        setLoading(true);
        setError(null);

        try {
            const movieResult = await searchMovieByName({
                title: searchText,
                pageNo,
                pageSize: 50,
            });

            const genreResult = await searchMoviesByGenre(searchText, pageNo, 50);

            const combinedResults = [
                ...(movieResult?.content || []),
                ...(genreResult?.content || []),
            ];

            const uniqueResults = combinedResults.filter((value, index, self) => {
                return index === self.findIndex((t) => t.idmovie === value.idmovie);
            });

            if (uniqueResults.length > 0) {
                setMovies(uniqueResults);

                const maxPages = Math.max(
                    movieResult?.totalPages || 0,
                    genreResult?.totalPages || 0
                );
                setTotalPages(maxPages);
            } else {
                setMovies([]);
            }
        } catch (err) {
            console.error("Error fetching search results:", err);
            setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(currentPage);
    }, [currentPage, searchText]);

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

    const formatThaiDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4 mt-4">ผลลัพธ์การค้นหาสำหรับ: "{searchText}"</h2>

            {loading ? (
                <div className="text-center">กำลังโหลด...</div>
            ) : movies.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {movies.map((item) => (
                        <Link
                            to={`/movies/${item.title}/${item.idmovie}`}
                            key={item.idmovie}
                        >
                            <div
                                className="flex flex-row bg-white rounded-lg shadow-lg hover:shadow-xl border border-gray-200 transition duration-300 ease-in-out"
                            >
                                <div className="w-full flex flex-row">
                                    {item.poster_path && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                            alt={item.title}
                                            className="w-auto max-w-[100px] h-auto rounded-l-md"
                                        />
                                    )}
                                    <div className="flex flex-col ml-2 p-4">
                                        <h3 className="text-lg font-medium text-gray-800">
                                            {item.title}
                                        </h3>
                                        {item.genres && (
                                            <p className="text-gray-400 text-sm">
                                                {item.genres.map((g) => g.name).join(", ")}
                                            </p>
                                        )}
                                        <p className="text-gray-400 text-sm">
                                            {item.release_date ? formatThaiDate(item.release_date) : "ไม่ระบุ"}
                                        </p>
                                        <p className="text-gray-600 mt-6 line-clamp-2 text-sm">
                                            {item.overview || "ไม่มีคำอธิบาย"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen">ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา</div>
            )}
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
        </div>

    );
};

export default SearchResults;
