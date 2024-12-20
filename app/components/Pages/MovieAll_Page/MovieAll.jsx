import React, { useEffect, useState, useRef, useCallback } from "react";
import { getMoviesByGenre } from "../../../service/movieService";
import MovieCard from "./MovieCard";
import { getAllGenres } from "../../../service/genreService";
import { faAngleRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const MovieAll = () => {
  const [genres, setGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleMovies, setVisibleMovies] = useState({});
  const [scrollStatus, setScrollStatus] = useState({});

  const movieContainerRefs = useRef({});

  useEffect(() => {
    const fetchGenresAndMovies = async () => {
      try {
        const genresData = await getAllGenres();
        setGenres(genresData);

        const moviesData = {};
        const visibleMoviesData = {};

        for (let genre of genresData) {
          const movies = await getMoviesByGenre(genre.name);
          moviesData[genre.name] = movies;
          visibleMoviesData[genre.name] = 20;
        }

        setMoviesByGenre(moviesData);
        setVisibleMovies(visibleMoviesData);

        const initialScrollStatus = genresData.reduce((acc, genre) => {
          acc[genre.name] = { canScrollLeft: false, canScrollRight: true };
          return acc;
        }, {});
        setScrollStatus(initialScrollStatus);
      } catch (error) {
        console.error("Error loading genres and movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenresAndMovies();
  }, []);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleLoadMore = (genre) => {
    setVisibleMovies((prev) => {
      const updatedVisibleMovies = { ...prev, [genre]: prev[genre] + 10 };
      updateScrollStatus(genre);
      return updatedVisibleMovies;
    });
  };

  const updateScrollStatus = useCallback(
    debounce((genre) => {
      const container = movieContainerRefs.current[genre];
      if (container) {
        const canScrollLeft = container.scrollLeft > 0;
        const canScrollRight =
          container.scrollLeft + container.clientWidth < container.scrollWidth;

        setScrollStatus((prev) => ({
          ...prev,
          [genre]: { canScrollLeft, canScrollRight },
        }));
      }
    }, 100),
    []
  );

  const handleScrollLeft = (genre) => {
    const container = movieContainerRefs.current[genre];
    if (container) {
      container.scrollBy({ left: -800, behavior: "smooth" });
      updateScrollStatus(genre);
    }
  };

  const handleScrollRight = (genre) => {
    const container = movieContainerRefs.current[genre];
    if (container) {
      container.scrollBy({ left: 800, behavior: "smooth" });
      updateScrollStatus(genre);
    }
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
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-2xl md:text-3xl text-purple-600 font-bold mb-4 relative">
              <span className="mr-4">|</span>
              {genre.name}
            </h2>

            <div className="flex items-center space-x-2 text-sm text-gray-400 mt-2 relative cursor-pointer hover:text-gray-600 transition duration-300">
              <Link
                to={`/movies/genres/${genre.name}`}
                className="flex items-center space-x-2"
              >
                <h3>ShowAll</h3>
                <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="w-full flex">
            <hr className="border-t-2 text-teal-500 w-full" />
          </div>

          {moviesByGenre[genre.name]?.length > 0 ? (
            <div className="relative flex flex-col">
              <div className="relative">

                {scrollStatus[genre.name]?.canScrollLeft && (
                  <button
                    onClick={() => handleScrollLeft(genre.name)}
                    className="absolute left-0 z-10 bg-gray-900 bg-opacity-70 p-4 -ml-8 rounded-md shadow-md hover:bg-opacity-100 transition duration-300"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className="text-white h-4 w-4"
                    />
                  </button>
                )}

                <div
                  ref={(el) => (movieContainerRefs.current[genre.name] = el)}
                  onScroll={() => updateScrollStatus(genre.name)}
                  className="flex overflow-x-auto gap-6 movie-container overflow-y-hidden scrollbar-hide scroll-smooth"
                >
                  {moviesByGenre[genre.name]
                    .slice(0, visibleMovies[genre.name])
                    .map((movie) => (
                      <MovieCard key={movie.idmovie} movie={movie} />
                    ))}
                  {moviesByGenre[genre.name]?.length > visibleMovies[genre.name] && (
                    <div>
                      <button
                        onClick={() => handleLoadMore(genre.name)}
                        className="mb-6 mt-6 bg-indigo-500 bg-opacity-50 hover:bg-opacity-80 text-white rounded w-[80px] h-[480px] "
                      >
                        <FontAwesomeIcon icon={faAngleRight} className="h-8 w-8" />
                      </button>
                    </div>
                  )}
                </div>

                {scrollStatus[genre.name]?.canScrollRight && (
                  <button
                    onClick={() => handleScrollRight(genre.name)}
                    className="absolute right-0 z-10 bg-gray-900 bg-opacity-70 p-4 -mr-8 rounded-md shadow-md hover:bg-opacity-100 transition duration-300"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-white h-4 w-4"
                    />
                  </button>
                )}
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
