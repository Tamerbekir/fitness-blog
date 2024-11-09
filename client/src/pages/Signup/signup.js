import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMutation } from '@apollo/client';
import { ADD_PROFILE } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import { useState } from 'react';
import { ToastContainer, Bounce ,toast } from 'react-toastify';

export {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  LockOutlinedIcon,
  Typography,
  ToastContainer,
  Container,
  createTheme,
  ThemeProvider,
  useMutation,
  ADD_PROFILE,
  Auth,
  useState,
  toast,
  Bounce,
  Link
}