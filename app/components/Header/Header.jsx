"use client";

import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import throttle from "lodash/throttle";
import debounce from 'lodash.debounce';

import {
  faBars,
  faTimes,
  faChevronDown,
  faChevronUp,
  faUser,
  faSearch,
  faFilm,
  faTags
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllGenres, searchGenreByName } from "../../service/genreService";
import { getMoviesByGenre, searchMovieByName, searchMovies } from "../../service/movieService";
import AuthPage from "../Pages/Login_Page/AuthPage";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState("");
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownIcon, setDropdownIcon] = useState(faChevronDown);
  const [loadingMovies, setLoadingMovies] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();

  const handleModalOpen = () => {
    setShowLoginModal(true);
  };

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 50);
    }, 200);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        setGenres(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch Genres");
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Search
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim()) {
        setLoadingMovies(true);
        try {
          const movieResult = await searchMovieByName({ title: query, pageNo: 0, pageSize: 10 });
          const genreResult = await searchGenreByName({ name: query, pageable: { page: 0, size: 10 } });

          const combinedResults = [...(movieResult?.content || []), ...(genreResult?.content || [])];
          setMovies(combinedResults);
        } catch (error) {
          console.error("Debounced Search Failed", error);
          setMovies([]);
        } finally {
          setLoadingMovies(false);
        }
      } else {
        setMovies([]);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      setLoadingMovies(true);
      try {
        const movieResult = await searchMovieByName({ title: searchText, pageNo: 0, pageSize: 10 });
        const genreResult = await searchGenreByName({ name: searchText, pageable: { page: 0, size: 10 } });

        const combinedResults = [...(movieResult?.content || []), ...(genreResult?.content || [])];
        setMovies(combinedResults);
        navigate(`/search/${searchText}`);
        handleSearchResultClick(combinedResults);
      } catch (error) {
        console.error("Search Failed", error);
        setMovies([]);
      } finally {
        setLoadingMovies(false);
      }
    }
  };

  const handleSearchResultClick = (item) => {
    setSearchText("");
    debouncedSearch.cancel();
    setMovies([]);
    setIsSearchActive(false);
  };

  const handleSearchToggle = () => {
    setIsSearchActive((prev) => !prev);
    if (isSearchActive) {
      setSearchText("");
      setMovies([]);
    }
  };

  // LOGIN
  const handleLogin = (e) => {
    e.preventDefault();
  };

  const handleRegister = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <header
        className={`bg-header shadow-md sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "py-1" : "py-2"
          }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between relative">
          <div className="flex items-center">
            <img
              src="/MOVIE.png"
              alt="Logo"
              className={`mr-3 transition-all duration-300 my-3 ${isScrolled ? "h-8 md:h-10" : "h-12 md:h-16"
                } object-contain`}
              style={{ maxWidth: "250px" }}
            />
            <div className="block">
              <h1 className="text-gray-700 text-xl md:text-2xl font-bold transition-opacity duration-300">
                TMDB
              </h1>
              {!isScrolled && (
                <h5 className="text-gray-700 text-xs md:text-lg mb-1">MOVIE</h5>
              )}
            </div>
          </div>

          <button
            className="text-gray-700 hover:text-indigo-500 flex items-center space-x-2 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faTimes : faBars}
              className="h-6 w-6 text-indigo-400"
            />
          </button>

          <nav
            className={`hidden md:flex space-x-6 ${isScrolled ? "md:space-x-4" : "md:space-x-6"
              }`}
          >
            <Link to="/" className="block text-indigo-400 hover:text-gray-700 py-2">
              หน้าแรก
            </Link>
            <Link
              to="/movies/movieall"
              className="block text-indigo-400 hover:text-gray-700 py-2"
            >
              ภาพยนต์
            </Link>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => (prev === "genres" ? "" : "genres"))}
                className="block text-indigo-400 hover:text-gray-700 py-2"
              >
                หมวดหมู่ <FontAwesomeIcon icon={faChevronDown} />
              </button>

              {dropdownOpen === "genres" && (
                <div
                  className="absolute bg-white shadow-lg rounded-md mt-2 z-10 w-full md:w-96 max-h-96 border border-gray-200 overflow-y-auto left-1/2 transform -translate-x-3/4"
                >
                  {loading ? (
                    <div className="px-4 py-2 text-gray-500">กำลังโหลด...</div>
                  ) : error ? (
                    <div className="px-4 py-2 text-red-500">{error}</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                      {genres
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((genre) => (
                          <Link
                            key={genre.name}
                            to={`/movies/genres/${genre.name}`}
                            className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md text-center"
                            onClick={() => setDropdownOpen("")}
                          >
                            {genre.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
          <div className="hidden md:flex items-center space-x-4 w-full md:w-auto">
            <div className="hidden md:flex items-center space-x-4 w-full md:w-auto">
              {isSearchActive ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleSearchToggle}
                    className="text-gray-500 hover:text-indigo-400"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={handleSearchToggle}
                  className="text-indigo-400 hover:text-gray-700 py-2"
                >
                  <FontAwesomeIcon icon={faSearch} className="h-6 w-6" />
                </button>
              )}
            </div>
            <button
              onClick={handleModalOpen}
              className="hidden md:block text-indigo-400 hover:text-gray-700 py-2"
            >
              <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div>
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}

          <div
            className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
            style={{ width: "250px" }}
          >
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
            <div className="p-4 flex flex-col h-full bg-purple-600">
              <h2 className="text-lg text-white font-bold mb-4">TMDB MOVIE</h2>
              <div className="w-full flex justify-center mb-6">
                <hr className="border-t-1 text-white w-full" />
              </div>
              <ul className="space-y-4 p-4 flex-grow">
                <li>
                  <Link to="/" className="text-sm text-bold block text-white hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
                    หน้าแรก
                  </Link>
                </li>
                <li>
                  <Link to="/movies/movieall" className="text-sm block text-white hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
                    ภาพยนต์
                  </Link>
                </li>
                <li>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setDropdownOpen((prev) => (prev === "genres" ? "" : "genres"));
                        setDropdownIcon((prev) => (prev === faChevronDown ? faChevronUp : faChevronDown));
                      }}
                      className="text-sm block text-white hover:text-gray-300 py-2"
                    >
                      หมวดหมู่ <FontAwesomeIcon icon={dropdownIcon} />
                    </button>
                    {dropdownOpen === "genres" && (
                      <ul className="bg-white shadow-lg rounded-md mt-2 z-10 w-full max-h-96 overflow-y-auto p-2 space-y-1 border border-gray-200">
                        {loading ? (
                          <li className="px-4 py-2 text-gray-500">กำลังโหลด...</li>
                        ) : error ? (
                          <li className="px-4 py-2 text-red-500">{error}</li>
                        ) : (
                          genres
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((genre) => (
                              <li key={genre.name} className="w-full">
                                <Link
                                  to={`/movies/genres/${genre.name}`}
                                  className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                                  onClick={() => {
                                    setDropdownOpen("");
                                    setDropdownIcon(faChevronDown);
                                    setIsMobileMenuOpen(false);
                                  }}
                                >
                                  {genre.name}
                                </Link>
                              </li>
                            ))
                        )}
                      </ul>
                    )}
                  </div>
                </li>
              </ul>
              <button
                onClick={handleModalOpen}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold hover:shadow-xl hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 rounded-full py-3 px-8 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      {isSearchActive && (
        <div
          className="absolute left-0 right-0 mx-auto bg-white shadow-lg rounded-md container max-w-screen-lg w-full mt-2 p-4 z-20"
        >
          <div className="flex flex-row mb-4">
            <FontAwesomeIcon icon={faSearch} className="h-4 w-4 py-3 mr-2 ml-2" />
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit(e);
                }
              }}
              placeholder="พิมพ์ข้อความที่จะค้นหา..."
              className="w-full border-none rounded-md px-3 py-2 focus:outline-none"
            />
          </div>

          <div className="ml-6">
            {loadingMovies ? (
              <div className="text-gray-500">กำลังโหลด...</div>
            ) : movies.length > 0 ? (
              movies.map((item) => (
                <Link
                  key={item.idmovie || item.idgen}
                  to={
                    item.idmovie
                      ? `/movies/${item.title}/${item.idmovie}`
                      : `/movies/genres/${item.name}`
                  }
                  className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => handleSearchResultClick(item)}
                >
                  <FontAwesomeIcon
                    icon={item.idmovie ? faFilm : faTags}
                    className="h-3 w-3 mr-2 ml-2"
                  />
                  <strong>
                    {item.title || item.name}
                  </strong>
                </Link>
              ))
            ) : (
              <div className="text-gray-500 mt-2 ml-2">
                ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา
              </div>
            )}
          </div>

        </div>
      )}
      
      <AuthPage showModal={showLoginModal} setShowModal={setShowLoginModal} />
    </>
  );
}

export default Header;
