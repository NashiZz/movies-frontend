"use client";

import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Pages/Home_Page/Home';
import MovieAll from './components/Pages/MovieAll_Page/MovieAll';
import MovieDetail from './components/Pages/MovieDetail_Page/MovieDetail';
import MovieGenres from './components/Pages/MovieGenres_Page/MovieGenres';
import Root_Page from './components/Root_Page';
import SearchResults from "./components/Pages/Search_Page/SearchMovie_Page";

const AppRouter = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
