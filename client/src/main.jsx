import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import './index.css'

import { 
  createBrowserRouter, 
  RouterProvider 
} from 'react-router-dom';

import {
  Home,
  Profile, 
  Topic,
  Comment,
  Post
} from './pages/index.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index : true, element: <Home /> },
      { path: 'profile', element: <Profile /> },
      { path: 'comment', element: <Comment /> },
      { path: 'post', element: <Post /> },
      { path: 'topic', element: <Topic /> },
],
  },
]);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
