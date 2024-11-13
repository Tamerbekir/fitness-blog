import {
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
  DateFormat,
  AccessPrompt
} from './account';
import 'react-toastify/dist/ReactToastify.css';
import './assets/account.css';

import { Form, Button, Container, Row, Col, InputGroup, FormControl as RBFormControl } from 'react-bootstrap';

const Account = () => {
  // Used to ensure user is logged in during development purposes only
  const loggedIn = Auth.loggedIn();
  // setting up loading, error, and data variables when querying the user "me" details 
  const { loading, error, data } = useQuery(QUERY_ME);
  // using the UPDATE PROFILE mutation to update users info
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [removeProfile] = useMutation(REMOVE_PROFILE);
  // setting up useState for showing a form when clicked 
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPasswordForm, setPasswordForm] = useState(false);
  const [removeAcctForm, setRemoveAcctForm] = useState(false);

  // setting up the useState for the user and the info that will be used when changing their settings. Empty strings.
  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
    location: '',
    socialHandle: '',
    bio: ''
  });

  // setting up useState for password field separately 
  const [userPwdInfo, setUserPwdInfo] = useState({
    password: '',
    confirmPassword: ''
  });

  // Redirect to login if user is not logged in
  // const loginPage = () => {
  //   window.location.href = './login';
  // };

  // useEffect for populating userInfo with data when it exists
  useEffect(() => {
    if (data && data.me) {
      setUserInfo({
        email: data.me.email || '',
        username: data.me.username || '',
        password: data.me.password || '',
        confirmPassword: data.me.password || '',
        bio: data.me.bio || 'No bio added',
        location: data.me.location || 'No Location added',
        socialHandle: data.me.socialHandle || 'No social added',
      });
      setUserPwdInfo({
        password: data.me.password || '',
        confirmPassword: data.me.password || '',
      });
    }
  }, [data]);

  // handling the useState for handling the users email, username, bio, etc text fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  // handling the useState for handling the users password text fields
  const handlePwdChange = (event) => {
    const { name, value } = event.target;
    setUserPwdInfo({
      ...userPwdInfo,
      [name]: value,
    });
  };

  // a function that handles when the delete account form is activated or not
  // set to true because the form will show when calling the function
  const handleDeleteForm = () => {
    setRemoveAcctForm(true);
  };

  // a function that handles when changing the users settings form is activated or not
  // set to true because the form will show when calling the function
  const handleChangeInfo = () => {
    setShowUserForm(true);
  };

  // a function that handles when the password form is activated or not
  // set to true because the form will show when calling the function
  const handlePasswordInfo = () => {
    setPasswordForm(true);
  };

  // a function that handles when to close the form is activated or not
  // set to false because the form will close when calling the function
  const handleCloseAll = () => {
    setShowUserForm(false);
    setPasswordForm(false);
  };

  // removingProfile mutation. taking in the _id from the query me and removing it from the database
  // the _id is the variable name we are giving it, data is what we loaded in via the query me, 'me' is the query we are grabbing it from, and the '_id' is what we are using from within the 'me' query.
  // applying UI for toastify and having user logOut after function is called.
  // function called, in this case, within the delete btn
  const handleDeleteAcctChange = async () => {
    try {
      const { data: deleteUser } = await removeProfile({
        variables: {
          _id: data.me._id,
        },
      });
      toast.warning('Your account has been deleted. Bye!', {
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
      Auth.logout();
    } catch (error) {
      console.error('There was an error deleting profile:', error);
    }
  };

  // a function thats called when the user clicks on the save button
  // the function will confirm the passwords and if they dont match, will get alert via UI toastify
  const handleSaveChange = async () => {
    if (userPwdInfo.password !== userPwdInfo.confirmPassword) {
      toast.error('Passwords do not match', {
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

    // using updateProfile mutation. Taking in custom names and assigning the value to them. Using the handleSaveChange function, user will get a confirmation upon save.
    // taking in both useState names and variables from userInfo and userPwdInfo  
    //! keep in mind, confirmPassword is NOT part of the query me and is only added to the useState and given a variable because its only purpose is to match the password textfield below when the user changes their password and is NOT being added or updated to the database. The only thing added to the database is the password variable
    try {
      const { data: updateUserInfo } = await updateProfile({
        variables: {
          ...userInfo,
          username: userInfo.username,
          email: userInfo.email,
          password: userPwdInfo.password,
          confirmPassword: userPwdInfo.confirmPassword,
          bio: userInfo.bio,
          socialHandle: userInfo.socialHandle,
          location: userInfo.location,
        },
      });
      toast.success('Your changes have been saved', {
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
    } catch (error) {
      console.error(error);
      toast.error('There was an issue saving your new information', {
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

  // const login = () => {
  //   window.location.href = "./login";
  // };

  // const signUp = () => {
  //   window.location.href = "./signup";
  // };

  // Return early if data is loading, an error occurred, or `data.me` is not defined
  if (loading) return <p>Loading your profile.</p>;
  if (error) return <p>{error}</p>
  if (!loggedIn) {
    return (
      <div>
        <Form.Label>Member Access Only</Form.Label>
        <AccessPrompt />
      </div>
    );
  }

  // Render the component if `data.me` exists
  return (
    <Container>
      {!showUserForm && (
        <>
          <h3 className='welcomeText'>Hey there, {userInfo.username}. Feel free to make changes to your account below</h3>
          <div className="user-info-container">
            <div className="user-info-item mb-3">
              <strong>Email:</strong> <p className='userEmailField'>{userInfo.email}</p>
            </div>
            <div className="user-info-item mb-3">
              <strong>Username:</strong> <p className='usernameField'>{userInfo.username}</p>
            </div>
            <div className="user-info-item mb-3">
              <strong>Location:</strong> <p className='userLocationField'>{userInfo.location}</p>
            </div>
            <div className="user-info-item mb-3">
              <strong>Social:</strong> <p className='userSocialHandleField'>{userInfo.socialHandle}</p>
            </div>
            <div className="user-info-item mb-3">
              <strong>Bio:</strong> <p className='userBioField'>{userInfo.bio}</p>
            </div>
            <Button className='changeSettingsBtn' onClick={handleChangeInfo}>Change Account Settings</Button>
          </div>
          <div>
            <p className='dateFormat'>Account created on <DateFormat createdAt={data.me.createdAt} /></p>
          </div>
        </>
      )}
      {showUserForm && (
        <Form>
          <Form.Group className='userEmailDiv mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              className='userEmail'
              type='text'
              name='email'
              value={userInfo.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className='usernameDiv mb-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              className='username'
              type='text'
              name='username'
              value={userInfo.username}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className='userLocationDiv mb-3'>
            <Form.Label>Location</Form.Label>
            <Form.Control
              as='select'
              className='userLocation'
              name='location'
              value={userInfo.location}
              onChange={handleInputChange}
            >
              <option value="">Do Not Wish To Disclose</option>
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Los Angeles">Los Angeles</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className='userSocialHandleDiv mb-3'>
            <Form.Label>Social Handle</Form.Label>
            <Form.Control
              className='userSocialHandle'
              type='text'
              name='socialHandle'
              value={userInfo.socialHandle}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className='userBioDiv mb-3'>
            <Form.Label>Bio</Form.Label>
            <Form.Control
              className='userBio'
              type='text'
              name='bio'
              value={userInfo.bio}
              onChange={handleInputChange}
              as='textarea'
              rows={5}
            />
          </Form.Group>
          {!showPasswordForm && (
            <>
              <Button onClick={handlePasswordInfo} className="mt-3 changePasswordBtn">Change Password</Button>

              <Button type="button" onClick={() => {
                handleSaveChange(), setShowUserForm(false)
              }} className="mt-3 applyBtn">Apply</Button>

              {/* <Button type="button" onClick={() => className = "mt-3 doneBtn" > Done</Button> */}

            </>
          )
          }
        </Form >
      )}
      {
        showPasswordForm && (
          <Form>
            <Form.Group className='userPwdDiv mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                className='userPassword'
                type='password'
                name='password'
                value={userPwdInfo.password}
                onChange={handlePwdChange}
              />
            </Form.Group>
            <Form.Group className='userConfirmPwdDiv mb-3'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                className='userPassword'
                type='password'
                name='confirmPassword'
                value={userPwdInfo.confirmPassword}
                onChange={handlePwdChange}
              />
            </Form.Group>

            <Button type="button" onClick={handleSaveChange} className="mt-3 applyBtn">Apply</Button>


            <Button type='button' onClick={handleCloseAll} className="mt-3 doneBtn">Done</Button>


          </Form>
        )
      }
      {
        !removeAcctForm && !showPasswordForm && !showUserForm && (
          <Button className='deleteAcctBtn' onClick={handleDeleteForm} variant="danger">Delete Account</Button>
        )
      }
      {
        removeAcctForm && !showPasswordForm && !showUserForm && (
          <div>
            <p className='confirmDeleteText'>Are you sure you want to delete your account? This is irreversible</p>
            <Button className='deleteAcctBtn' type="button" onClick={handleDeleteAcctChange} variant="danger">Confirm Delete</Button>
            <Button className='cancelAcctDeleteBtn ms-2' type="button" onClick={() => setRemoveAcctForm(false)}>Cancel</Button>
          </div>
        )
      }
    </Container >
  );
}
export default Account;
