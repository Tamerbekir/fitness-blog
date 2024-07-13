
import { 
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
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
  } from './signup'

import './assets/signup.css';
import 'react-toastify/dist/ReactToastify.css';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Fitness Blog
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme()

const Signup = () => {

  const [userLogin, setUserLogin] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // adding mutation for adding profile
  const [addProfile] = useMutation(ADD_PROFILE)

  // handling function that registers the user inputs in the text field
  //updates the userLogin useState
  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserLogin({
      ...userLogin,
      [name]: value,
    });
  };


  const confirmSignup = async (event) => {
    event.preventDefault();

    // general if statements that trigger if user is missing information
    // trigger setError useState if information does not meet criteria
    //using Toastify for UI aesthetics
    if (!userLogin.username || !userLogin.email || !userLogin.password) {
      toast.error('Please fill out all fields', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      return;
    }


    if (userLogin.password !== userLogin.confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      return
    }

    // using the variables from the addProfile mutation, we enter it into the useState
    // for example, the mutation addProfile for username = useState username input field from the userLogin useState
    try {
      const { data } = await addProfile({
        variables: {
          username: userLogin.username,
          email: userLogin.email,
          password: userLogin.password,
          // confirmPassword: userLogin.confirmPassword
        },
      });
      // checking to see if the data.addProfile object has a token property. If it does, profile was created successfully and a token was returned.
      if (data.addProfile.token) {
        Auth.login(data.addProfile.token);
        // This line calls the login method of the Auth object, passing the token obtained from the addProfile mutation. The token is now stored with the logged in user
        toast.success('Welcome to the Fitness Blog!', {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('There was an error creating your account. Please check your information and try again', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    }
  };

  const handleSubmit = (event) => {
    //boiler plate from template with additional console.logging for testing
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword'),
    });
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
            onSubmit={confirmSignup}
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  required
                  variant='filled'
                  fullWidth
                  id="firstName"
                  label="Username"
                  autoFocus
                  className='userNameInput'
                  type="text"
                  name="username"
                  value={userLogin.username}
                  onChange={handleUserChange}
                />
              </Grid>
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
                <small>Passwords must be minimum 10 characters long</small>
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
                <TextField
                  variant='filled'
                  label="Confirm Password"
                  required
                  fullWidth
                  className='userPasswordInput'
                  type="password"
                  name="confirmPassword"
                  value={userLogin.confirmPassword}
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
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="./login" variant="body2">
                  Already have an account? Login
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

export default Signup;
