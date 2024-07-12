import { 
  useState,
  Form,
  Button,
  FloatingLabel,
  ToastContainer,
  toast,
  Bounce
  } from './signup'

import { useMutation } from '@apollo/client';
import { ADD_PROFILE } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import './assets/signup.css';
import 'react-toastify/dist/ReactToastify.css';

// setting useState for taking in user information
const Signup = () => {
  const [userLogin, setUserLogin] = useState({
    username: '',
    email: '',
    password: '',
  });

// setting useState for an error message that occur
  const [error, setError] = useState({
    username: '',
    email: '',
    password: '',
  });

  // const [addProfile, { error: mutationError }] = useMutation(ADD_PROFILE);

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

  const loginOption = () => {
    window.location.href = './login'
  }

  const confirmSignup = async (event) => {
    event.preventDefault();

    // general if statements that trigger if user is missing information
    // trigger setError useState if information does not meet criteria
    //using Toastify for UI aesthetics
    if (!userLogin.username || !userLogin.email || !userLogin.password) {
      setError({
        username: !userLogin.username ? 'Please provide a username' : '',
        email: !userLogin.email ? 'Please provide a email' : '',
        password: !userLogin.password ? 'Please provide a password' : '',
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
      const { data } = await addProfile({
        variables: {
          username: userLogin.username,
          email: userLogin.email,
          password: userLogin.password,
        },
      });
      // checking to see if the data.addProfile object has a token property. If it does, profile was created successfully and a token was returned.
      if (data.addProfile.token) {
        Auth.login(data.addProfile.token);
        // This line calls the login method of the Auth object, passing the token obtained from the addProfile mutation. The token is now stored with the logged in user
        toast.success('Welcome to the Fitness Blog!', {
          position: 'bottom-left',
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
      toast.error('There was an error creating your account.', {
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
      <h1 className='signupHeader' id='signup'>Sign up</h1>
      <Form onSubmit={confirmSignup} className='contactContainer'>
        <br />
        <Form.Text className='loginName'></Form.Text>
        <FloatingLabel label="Username">
          <Form.Control
            className='userNameInput'
            type="text"
            name="username"
            value={userLogin.username}
            onChange={handleUserChange}
          />
        </FloatingLabel>
        <p style={{ color: '#F56742' }}>{error.username}</p>
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
          Create Account
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
      className='loginHere'
      onClick={loginOption}
      >Already have an account? Login up here </button>
    </div>
  );
};

export default Signup;
