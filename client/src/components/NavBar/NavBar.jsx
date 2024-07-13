import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import Auth from '../../../utils/auth'

import { useEffect, useState } from 'react';

import './assets/navBar.css'


const NavBar = () => {
  //using useState to determine if user is logged in or not
  const [loggedIn, setIsLoggedIn] = useState(false)

  // useEffect for logging user in 
  // this is ALSO used to determine if user is logged in
  // setting useState to users login auth/token
  useEffect(() => {
    const loggedIn = Auth.loggedIn()
    setIsLoggedIn(loggedIn)
  }, [])

  // handling logout by user using logout method
  const handleLogout = () => {
    Auth.logout()
  }

  // handling user login, redirecting to login window
  const handleLoginPage = () => {
    window.location.href = './login'
  }

  const handleProfilePage = () => {
    window.location.href = './profile'
  }

  const handleAccountPage = () => {
    window.location.href = './account'
  }

  const handleCreatePostPage = () => {
    window.location.href = './create-post'
  }
  const handleLogWorkoutPage = () => {
    window.location.href = './log-workout'
  }
  const handleHomePage = () => {
    window.location.href = './'
  }

  //variable that used to determine user is not logged in
  const notLoggedIn = !Auth.loggedIn()


  //! Boiler plate navBar from Material MUI
  //! Adjustments were made to meet criteria
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#44074d' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters className='header'>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Fitness Blog
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleHomePage}>
                <Typography>Home</Typography>
              </MenuItem>
              <MenuItem onClick={handleCreatePostPage}>
                <Typography>CreatePost</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogWorkoutPage}>
                <Typography>Log Workout</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Fitness
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              sx={{ my: 2, color: 'white'}}
            >
              <MenuItem onClick={handleHomePage}>
                <Typography>Home</Typography>
              </MenuItem>
              <MenuItem onClick={handleCreatePostPage}>
                <Typography>Create Post</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogWorkoutPage}>
                <Typography>Log Workout</Typography>
              </MenuItem>
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* {settings.map((setting) => ( */}
              <MenuItem>
                {notLoggedIn && <IconButton className='loginBtn' onClick={handleLoginPage}>Login</IconButton>}
                <IconButton onClick={handleProfilePage}>Profile</IconButton>
                <IconButton onClick={handleAccountPage}>Account</IconButton>
                {loggedIn && <IconButton className='logoutBtn' onClick={handleLogout}>Logout</IconButton>}
                <Typography textAlign="center">{ }</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar