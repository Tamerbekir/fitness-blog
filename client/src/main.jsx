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
  Post,
  Login,
  Signup,
  Account
} from './pages/index.js'

import {
  NavBar
} from './components/index.js'



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
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'account', element: <Account /> },
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
