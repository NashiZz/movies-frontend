import React, { useEffect, useState, useRef } from "react";
import { getMoviesByGenre } from "../../../service/movieService";
import MovieCard from "./MovieCard";
import { getAllGenres } from "../../../service/genreService";

const MovieAll = () => {
  const [genres, setGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleMovies, setVisibleMovies] = useState({}); // เก็บจำนวนหนังที่แสดงในแต่ละหมวดหมู่

  const movieContainerRefs = useRef({});

  useEffect(() => {
    const fetchGenresAndMovies = async () => {
      try {
        const genresData = await getAllGenres();
        setGenres(genresData);

        const moviesData = {};
        const visibleMoviesData = {}; // เก็บจำนวนหนังที่จะแสดงในแต่ละหมวดหมู่

        for (let genre of genresData) {
          const movies = await getMoviesByGenre(genre.name);
          moviesData[genre.name] = movies;
          visibleMoviesData[genre.name] = 10; // เริ่มต้นแสดงแค่ 10 เรื่องแรก
        }

        setMoviesByGenre(moviesData);
        setVisibleMovies(visibleMoviesData);
      } catch (error) {
        console.error("Error loading genres and movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenresAndMovies();
  }, []);

  const handleShowMore = (genre) => {
    setVisibleMovies((prevState) => ({
      ...prevState,
      [genre]: prevState[genre] + 10, // เพิ่มจำนวนหนังที่จะแสดงอีก 10 เรื่อง
    }));
  };

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
            <div className="relative flex flex-col">
              <div
                ref={(el) => (movieContainerRefs.current[genre.name] = el)}
                className="flex overflow-x-auto gap-6 movie-container overflow-y-hidden"
              >
                {moviesByGenre[genre.name]
                  .slice(0, visibleMovies[genre.name]) // แสดงแค่จำนวนที่ระบุ
                  .map((movie) => (
                    <MovieCard key={movie.idmovie} movie={movie} />
                  ))}
              </div>

              {visibleMovies[genre.name] < moviesByGenre[genre.name]?.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handleShowMore(genre.name)}
                    className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
                  >
                    Show More
                  </button>
                </div>
              )}
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
