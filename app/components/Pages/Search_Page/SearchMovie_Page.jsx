import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMoviesByGenre, searchMovieByName } from "@/app/service/movieService";
import { searchGenreByName, searchMoviesByGenre } from "@/app/service/genreService";

const SearchResults = () => {
    const { searchText } = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);

            try {
                const movieResult = await searchMovieByName({
                    title: searchText,
                    pageNo: 0,
                    pageSize: 50,
                });

                const genreResult = await searchMoviesByGenre(searchText, 0, 50);

                const combinedResults = [
                    ...(movieResult?.content || []),
                    ...(genreResult?.content || []),
                ];

                const uniqueResults = combinedResults.filter((value, index, self) => {
                    return index === self.findIndex((t) => t.idmovie === value.idmovie);
                });

                console.log(uniqueResults);
                

                if (uniqueResults.length > 0) {
                    setMovies(uniqueResults);
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

        fetchMovies();
    }, [searchText]);

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
        </div>

    );
};

export default SearchResults;
