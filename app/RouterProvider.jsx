"use client";

import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Pages/Home_Page/Home';
import MovieAll from './components/Pages/MovieAll_Page/MovieAll';
import MovieDetail from './components/Pages/MovieDetail_Page/MovieDetail';
import MovieGenres from './components/Pages/MovieGenres_Page/MovieGenres';
import Root_Page from './components/Root_Page';
import SearchResults from "./components/Pages/Search_Page/SearchMovie_Page";
import { getUserProfile } from "./service/userService";
import ProfileUserPage from "./components/Pages/User_Page/Profile_Page";

const AppRouter = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // checkLoginStatus();
  }, []);

  // const checkLoginStatus = async () => {
  //   const token = localStorage.getItem("token");
  //   const user = localStorage.getItem("user");
  
  //   if (token && user) {
  //     const parsedUser = JSON.parse(user); 
  //     console.log("ผู้ใช้ล็อกอินอยู่:", parsedUser.username);
  //   } else {
  //     console.log("ยังไม่มีผู้ใช้ล็อกอิน");
  //   }
  // };
  
  if (!isClient) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root_Page />}>
          <Route index element={<Home />} />
          <Route path="/movies/movieall" element={<MovieAll />} />
          <Route path="/movies/:name/:id" element={<MovieDetail />} />
          <Route path="/movies/genres/:genreName" element={<MovieGenres />} />
          <Route path="/search/:searchText" element={<SearchResults />} />
          <Route path="/user/profile" element={<ProfileUserPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
