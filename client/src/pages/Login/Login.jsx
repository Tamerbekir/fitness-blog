import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import { useState } from 'react';
import { ToastContainer, Bounce, toast } from 'react-toastify';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://www.tamerbekir.com">
        Tamer Bekir
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme()

const Login = () => {

  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });

  // setting useState for an error message that occur
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  // adding mutation for adding profile
  const [login] = useMutation(LOGIN);

  // handling function that registers the user inputs in the text field
  //updates the userLogin useState
  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserLogin({
      ...userLogin,
      [name]: value,
    });
  };

  // const signUpOption = () => {
  //   window.location.href = "./signup";
  // };

  const confirmLogin = async (event) => {
    event.preventDefault();

    // general if statements that trigger if user is missing information
    // trigger setError useState if information does not meet criteria
    //using Toastify for UI aesthetics
    if (!userLogin.email || !userLogin.password) {
      setError({
        email: !userLogin.email ? "Please enter an email" : "",
        password: !userLogin.password ? "Please enter your password" : "",
      });
      toast.error("Please fill out all fields.", {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    // using the variables from the addProfile mutation, we enter it into the useState
    // for example, the mutation addProfile for username = useState username input field from the userLogin useState
    try {
      const { data } = await login({
        variables: {
          email: userLogin.email,
          password: userLogin.password,
        },
      });
      // checking to see if the data.addProfile object has a token property. If it does, profile was created successfully and a token was returned.
      if (data.login.token) {
        Auth.login(data.login.token);
        // This line calls the login method of the Auth object, passing the token obtained from the addProfile mutation. The token is now stored with the logged in user
        toast.success("Welcome back!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Incorrect username or password", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container component="main" maxWidth="xs" sx={{ color: 'white' }}>
          <CssBaseline />
          <Box
            onSubmit={confirmLogin}
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            <Typography component="h1" variant="h5">
              <p style={{ fontFamily: 'times new roman' }}>Welcome Back</p>
            </Typography>
            <Box component="form" sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    variant='filled'
                    fullWidth
                    id="email"
                    className='userEmailInput'
                    label="Email Address"
                    autoComplete="email"
                    type="email"
                    name="email"
                    value={userLogin.email}
                    onChange={handleUserChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    variant='filled'
                    required
                    fullWidth
                    className='userPasswordInput'
                    type="password"
                    name="password"
                    value={userLogin.password}
                    onChange={handleUserChange}
                  />
                </Grid>

                <Grid item xs={12}>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="./signup" variant="body2">
                    Dont have an account? Signup
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
