import Auth from '../../../utils/auth'
import { useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { UPDATE_PROFILE, REMOVE_PROFILE } from '../../../utils/mutations'
import { QUERY_ME } from '../../../utils/queries'
import { toast, Bounce } from 'react-toastify'
import TextField from '@mui/material/TextField';
import { DateFormat } from '../../components/index'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AccessPrompt from '../../components/AccessPrompt/AccessPrompt'


export {
  Auth,
  useQuery,
  useMutation,
  useState,
  useEffect,
  UPDATE_PROFILE,
  REMOVE_PROFILE,
  QUERY_ME,
  toast,
  Bounce,
  TextField,
  DateFormat,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  AccessPrompt
}