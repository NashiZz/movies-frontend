import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMoviesByGenre, searchMovieByName } from "@/app/service/movieService";

const SearchResults = () => {
    const { searchText } = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const result = await searchMovieByName({
                    title: searchText,
                    pageNo: 0,
                    pageSize: 20,
                });

                if (result?.content && result.content.length > 0) {
                    setMovies(result.content || []);
                } else {
                    const genreResult = await getMoviesByGenre(searchText);
                    setMovies(genreResult || []);
                }
            } catch (error) {
                console.error("Search Failed", error);
                setMovies([]);
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
                    {movies.map((movie) => (
                        <Link to={`/movies/${movie.title}/${movie.idmovie}`} key={movie.idmovie}>
                            <div
                                key={movie.idmovie}
                                className="flex flex-row bg-white rounded-lg shadow-lg hover:shadow-xl border border-gray-200 transition duration-300 ease-in-out"
                            >
                                <div className="w-full flex flex-row">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-auto max-w-[100px] h-auto rounded-l-md"
                                    />
                                    <div className="flex flex-col ml-2 p-4">
                                        <h3 className="text-lg font-medium text-gray-800">{movie.title}</h3>
                                        <p className="text-gray-400 text-sm">{movie.release_date ? formatThaiDate(movie.release_date) : "ไม่ระบุ"}</p>
                                        <p className="text-gray-600 mt-6 line-clamp-2 text-sm">
                                            {movie.overview}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center">ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา</div>
            )}
        </div>

    );
};

export default SearchResults;
