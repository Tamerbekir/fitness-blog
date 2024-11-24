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
  Login,
  Signup,
  Account,
  UserProfile,
  About,
  Calculator
} from './pages/index.js'

import {
  CreatePost,
  CreateWorkout,
  PlateCalculator,
} from './components/index.js'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'profile', element: <Profile /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'account', element: <Account /> },
      { path: 'userAccount', element: <UserProfile /> },
      { path: 'create-post', element: <CreatePost /> },
      { path: 'log-workout', element: <CreateWorkout /> },
      { path: 'about', element: <About /> },
      { path: 'userprofile/:id', element: <UserProfile /> },
      { path: 'maxrepcalculator', element: <Calculator /> },
      { path: 'platecalculator', element: <PlateCalculator /> }
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
