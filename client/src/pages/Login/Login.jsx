import { 
  useState,
  Form,
  Button,
  FloatingLabel,
  ToastContainer,
  toast,
  Bounce
  } from './login'

import { useMutation } from '@apollo/client';
import { LOGIN } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import './assets/login.css';
import 'react-toastify/dist/ReactToastify.css';

// setting useState for taking in user information
const Login = () => {
  const [userLogin, setUserLogin] = useState({
    email: '',
    password: '',
  });

// setting useState for an error message that occur
  const [error, setError] = useState({
    email: '',
    password: '',
  });


  // adding mutation for adding profile
  const [login] = useMutation(LOGIN)

  // handling function that registers the user inputs in the text field
  //updates the userLogin useState
  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserLogin({
      ...userLogin,
      [name]: value,
    });
  };

  const signUpOption = () => {
    window.location.href = './signup'
  }

  const confirmLogin = async (event) => {
    event.preventDefault();

    // general if statements that trigger if user is missing information
    // trigger setError useState if information does not meet criteria
    //using Toastify for UI aesthetics
    if (!userLogin.email || !userLogin.password) {
      setError({
        email: !userLogin.email ? 'Please enter an email' : '',
        password: !userLogin.password ? 'Please enter your password' : '',
      });
      toast.error('Please fill out all fields.', {
        position: 'top-left',
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
        toast.success('Logged in!', {
          position: 'top-left',
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
      toast.error('There was an error logging in.', {
        position: 'top-left',
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

  return (
    <div>
      <h1 className='loginHeader'>Login</h1>
      <Form onSubmit={confirmLogin} className='contactContainer'>
        <br />
        <Form.Text className='messageEmail'></Form.Text>
        <FloatingLabel label="Email">
          <Form.Control
            type="email"
            name="email"
            value={userLogin.email}
            onChange={handleUserChange}
          />
        </FloatingLabel>
        <p style={{ color: '#F56742' }}>{error.email}</p>
        <Form.Text className='passwordText'></Form.Text>
        <FloatingLabel label="Password">
          <Form.Control
            className='passwordInput'
            type="password"
            name="password"
            value={userLogin.password}
            onChange={handleUserChange}
          />
        </FloatingLabel>
        <p style={{ color: '#F56742' }}>{error.password}</p>
        <br />
        <Button type="submit" size="sm">
          Login
        </Button>
      </Form>
      <ToastContainer
        position="top-left"
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
      <br />
      <button
      className='signUpHere'
      onClick={signUpOption}
      >Don't have an account? Sign up here </button>
    </div>
  );
};

export default Login;
