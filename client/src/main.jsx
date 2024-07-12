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
  Login,
  Signup,
  Account,
} from './pages/index.js'

import {
  NavBar,
  CreatePost,
  CreateWorkout,
} from './components/index.js'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index : true, element: <Home /> },
      { path: 'profile', element: <Profile /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'account', element: <Account /> },
      { path: 'create-post', element: <CreatePost/>},
      { path: 'log-workout', element: <CreateWorkout/> }
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
