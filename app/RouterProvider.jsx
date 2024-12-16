'use client';

import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root_Page from './components/Root_Page';
import Home from './components/Pages/Home_Page/Home';
import MovieDetail from './components/Pages/MovieDetail_Page/MovieDetail';
import MovieGenres from './components/Pages/MovieGenres_Page/MovieGenres';
import MovieAll from './components/Pages/MovieAll_Page/MovieAll';

const AppRouter = () => {
  const [router, setRouter] = useState(null);

  useEffect(() => {
    const routers = createBrowserRouter([
      {
        path: '/',
        element: <Root_Page />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/movies/movieall', element: <MovieAll /> },
          { path: '/movies/:name/:id', element: <MovieDetail /> },
          { path: '/movies/genres/:genreName', element: <MovieGenres /> },
        ],
      },
    ]);
    setRouter(routers);
  }, []);

  if (!router) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
  </div>

  return <RouterProvider router={router} />;
};

export default AppRouter;
