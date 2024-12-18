"use client";

import { useState, useEffect } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllGenres } from "../../service/genreService";
import { getMoviesByGenre, searchMovieByName, searchMovies } from "../../service/movieService";

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

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const [loginError, setLoginError] = useState("");
  const [loadingMovies, setLoadingMovies] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const navigate = useNavigate();

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

        if (result?.content && result.content.length > 0) {
          setMovies(result.content || []);
          navigate(`/search/${searchText}`);
        } else {
          const genreResult = await getMoviesByGenre(searchText);
          setMovies(genreResult);
          navigate(`/search/${searchText}`);
        }
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

        if (result?.content && result.content.length > 0) {
          setMovies(result.content || []);
        } else {
          const genreResult = await getMoviesByGenre(query);
          setMovies(genreResult);
        }
      } catch (error) {
        console.error("Debounced Search Failed", error);
        setMovies([]);
      } finally {
        setLoadingMovies(false);
      }
    } else {
      setMovies([]);
    }
  }, 500);

  // const handleSearchSubmit = async (e) => {
  //   e.preventDefault();
  //   if (searchText.trim()) {
  //     setLoadingMovies(true);
  //     try {
  //       const result = await searchMovieByName({
  //         title: searchText,
  //         pageNo: 0,
  //         pageSize: 10,
  //       });
  //       setMovies(result?.content || []);

  //       navigate(`/search/${searchText}`);
  //     } catch (error) {
  //       console.error("Search Failed", error);
  //       setMovies([]);
  //     } finally {
  //       setLoadingMovies(false);
  //     }
  //   } else {
  //     setMovies([]);
  //   }
  // };

  // const debouncedSearch = debounce(async (query) => {
  //   if (query.trim()) {
  //     setLoadingMovies(true);
  //     try {
  //       const result = await searchMovieByName({
  //         title: query,
  //         pageNo: 0,
  //         pageSize: 10,
  //       });
  //       setMovies(result?.content || []);
  //     } catch (error) {
  //       setMovies([]);
  //     } finally {
  //       setLoadingMovies(false);
  //     }
  //   } else {
  //     setMovies([]);
  //   }
  // }, 500);

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
            {/* <button
              onClick={handleModalOpen}
              className="hidden md:block text-indigo-400 hover:text-gray-700 py-2"
            >
              <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
            </button> */}
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
                  setIsSearchActive(false);
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
              movies.map((movie) => (
                <Link
                  key={movie.idmovie}
                  to={`/movies/${movie.title}/${movie.idmovie}`}
                  className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => setIsSearchActive(false)}
                >
                  <FontAwesomeIcon icon={faSearch} className="h-3 w-3 mr-2 ml-2" />
                  <strong>{movie.title}</strong> - {movie.genres.map((g) => g.name).join(", ")}
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
