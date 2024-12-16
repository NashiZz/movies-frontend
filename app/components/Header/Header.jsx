"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import throttle from "lodash/throttle";
import debounce from 'lodash.debounce';

import {
  faBars,
  faTimes,
  faChevronDown,
  faUser,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllGenres } from "../../service/genreService";
import { searchMovieByName } from "../../service/movieService";

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

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const [loginError, setLoginError] = useState("");
  const [loadingMovies, setLoadingMovies] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleModalOpen = () => {
    setShowLoginModal(true);
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
  };

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.scrollY > 50.0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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

  const handleLogin = (e) => {
    e.preventDefault();
  };

  const handleRegister = (e) => {
    e.preventDefault();
  };

  const handleSearchToggle = () => {
    setIsSearchActive((prev) => !prev);
    if (isSearchActive) {
      setSearchText("");
      setMovies([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      setLoadingMovies(true);
      try {
        const result = await searchMovieByName({
          title: searchText,
          pageNo: 0,
          pageSize: 10,
        });
        setMovies(result?.content || []);
      } catch (error) {
        console.error("Search Failed", error);
        setMovies([]);
      } finally {
        setLoadingMovies(false);
      }
    } else {
      setMovies([]);
    }
  };

  const debouncedSearch = debounce(async (query) => {
    if (query.trim()) {
      setLoadingMovies(true);
      try {
        const result = await searchMovieByName({
          title: query,
          pageNo: 0,
          pageSize: 10,
        });
        setMovies(result?.content || []);
      } catch (error) {
        setMovies([]);
      } finally {
        setLoadingMovies(false);
      }
    } else {
      setMovies([]);
    }
  }, 500);

  return (
    <>
      <header
        className={`bg-header shadow-md sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "py-1" : "py-2"
          }`}
      >
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between relative">
          <div
            className="flex items-center w-full md:w-auto justify-center md:justify-start"
          >
            <img
              src="/MOVIE.png"
              alt="Logo"
              className={`mr-3 transition-all duration-300 my-3 ${isScrolled ? "h-8 md:h-10" : "h-12 md:h-16"
                } object-contain`}
              style={{ maxWidth: "250px" }}
            />

            <div className="block text-center md:text-left">
              <h1 className="text-gray-700 text-xl md:text-2xl font-bold transition-opacity duration-300">
                TMDB
              </h1>
              {!isScrolled && (
                <h5 className="text-gray-700 text-xs md:text-lg mb-1">
                  MOVIE
                </h5>
              )}
            </div>

            <button
              className="md:hidden text-gray-700 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="h-6 w-6 text-indigo-400 flex items-end"
              />
            </button>
          </div>

          <nav
            className={`md:flex ${isScrolled ? "md:space-x-4" : "md:space-x-6"
              } ${isMobileMenuOpen ? "block" : "hidden"} w-full md:w-auto`}
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
                <div className="absolute bg-white shadow-lg rounded-md mt-2 z-10 w-72 md:w-96 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="px-4 py-2 text-gray-500">กำลังโหลด...</div>
                  ) : error ? (
                    <div className="px-4 py-2 text-red-500">{error}</div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                      {genres
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((genre) => (
                          <Link
                            key={genre.name}
                            to={`/movies/genres/${genre.name}`}
                            className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md text-center"
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

          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              {isSearchActive ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="พิมพ์ข้อความที่จะค้นหา..."
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-indigo-300"
                  />
                  <button
                    type="submit"
                    className="text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-md"
                  >
                    ค้นหา
                  </button>
                  <button
                    type="button"
                    onClick={handleSearchToggle}
                    className="text-gray-500 hover:text-red-500"
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
              className="text-indigo-400 hover:text-gray-700 py-2"
            >
              <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {isSearchActive && movies.length > 0 && (
        <div className="absolute bg-white shadow-lg rounded-md mt-2 right-44 ml-8 w-full md:w-72 max-h-100 overflow-y-auto z-30">
          <div className="p-4">
            {movies.map((movie) => (
              <Link
                key={movie.idmovie}
                to={`/movies/${movie.title}/${movie.idmovie}`}
                className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md text-center"
              >
                {movie.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {isSearchActive && movies.length === 0 && (
        <div className="absolute bg-white shadow-lg rounded-md mt-2 right-44 ml-8 w-full md:w-72 max-h-60 overflow-y-auto z-10">
          <div className="p-4 text-gray-500">ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา</div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
            <button
              onClick={handleModalClose}
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-3xl"
            >
              &times;
            </button>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setActiveTab("login")}
                className={`px-4 py-2 text-lg font-semibold ${activeTab === "login"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
                  }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`px-4 py-2 text-lg font-semibold ${activeTab === "register"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
                  }`}
              >
                สมัครสมาชิก
              </button>
            </div>
            {activeTab === "login" ? (
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-gray-700">ชื่อผู้ใช้</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="กรุณาระบุชื่อผู้ใช้"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">รหัสผ่าน</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="กรุณาระบุรหัสผ่าน"
                  />
                </div>
                {loginError && <p className="text-red-500">{loginError}</p>}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md"
                >
                  ลงชื่อเข้าใช้
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="block text-gray-700">ชื่อจริง</label>
                  <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="กรุณาระบุชื่อจริง"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">นามสกุล</label>
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="กรุณาระบุนามสกุล"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">ที่อยู่</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="กรุณาระบุที่อยู่"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 rounded-md"
                >
                  สมัครสมาชิก
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
