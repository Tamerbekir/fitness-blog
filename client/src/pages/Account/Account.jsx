import {
  Auth,
  useQuery,
  useMutation,
  useState, 
  useEffect,
  UPDATE_PROFILE,
  REMOVE_PROFILE,
  QUERY_ME,
  ToastContainer,
  toast,
  Bounce,
  TextField,
  DateFormat,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from './account'
import 'react-toastify/dist/ReactToastify.css'
import './assets/account.css'




const Account = () => {
  //Used to ensure user is logged in during development purposes only
  const loggedIn = Auth.loggedIn()
  // setting up loading, error and data are the variables when querying the user me details 
  const { loading, error, data } = useQuery(QUERY_ME)
  // using the UPDATE PROFILE mutation to update users info
  const [updateProfile] = useMutation(UPDATE_PROFILE)
  const [removeProfile] = useMutation(REMOVE_PROFILE)
  // setting up a useState for showing the a form when clicked 
  const [showUserForm, setShowUserForm] = useState(false)
  const [showPasswordForm, setPasswordForm] = useState(false)
  const [removeAcctForm, setRemoveAcctForm] = useState(false)

  // setting up the useState for the user and the info that will be used when changing their settings. Empty strings. This useState will be used with the useEffect below as well as taking in whatever the user types in
  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
    location: '',
    socialHandle: '',
    bio: ''
  })

  // setting up useState for password field separately 
  const [userPwdInfo, setUserPwdInfo] = useState({
    password: '',
    confirmPassword: ''
  })



  // useEffect for placing pre existing userInfo IN SIDE of the empty strings in the useState above (userInfo, setUserInfo). // Doing the same for the password useState. This is so when the user saves their information and didnt change anything else, their current info stays in place
  useEffect(() => {
    if (data) {
      setUserInfo({
        email: data.me.email,
        username: data.me.username,
        password: data.me.password,
        confirmPassword: data.me.password,
        bio: data.me.bio || 'No bio added',
        location: data.me.location || 'No Location added',
        socialHandle: data.me.socialHandle || 'No social added',
      })
      setUserPwdInfo({
        password: data.me.password,
        confirmPassword: data.me.password,
      })
    }
  }, [data])

  // handling the useState for handling the users email, username, bio, etc text fields
  
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setUserInfo({
      ...userInfo,
      [name]: value
    })
  }

  // handling the useState for handling the users password text fields
  const handlePwdChange = (event) => {
    const { name, value } = event.target
    setUserPwdInfo({
      ...userPwdInfo,
      [name]: value
    })
  }

  // a function that handles when the delete account form is activated or not
  // set to true because the form will show when calling the function
  const handleDeleteForm = () => {
    setRemoveAcctForm(true)
  }

  // a function that handles when changing the users settings form is activated or not
  // set to true because the form will show when calling the function
  const handleChangeInfo = () => {
    setShowUserForm(true)
  }

  // a function that handles when the password form is activated or not
  // set to true because the form will show when calling the function
  const handlePasswordInfo = () => {
    setPasswordForm(true)
  }

    // a function that handles when to close the form is activated or not
  // set to false because the form will close when calling the function
  const handleCloseAll = () => {
    setShowUserForm(false)
    setPasswordForm(false)
  }

  // removingProfile mutation. taking in the _id from the query me and removing it from the database
  // the _id is the variable name we are giving it, data is what we loaded in via the query me, 'me' is the query we are grabbing it from, and the '_id' is what we are using from within the 'me' query.
  // applying UI for toastify and having user logOut after function is called.
  // function called, in this case, within the delete btn
  const handleDeleteAcctChange = async () => {
    try {
          const { data: deleteUser } = await removeProfile({
            variables: {
              _id: data.me._id
            }
          })
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
          })
          Auth.logout()
    } catch (error) {
      console.error('There was an error deleting profile:', error)
    }
  }

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
      })
      return
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
          socialHandle: userInfo.socialHandle ,
          location: userInfo.location,
        }
      })
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
      })
      // setShowUserForm(false)
      // setPasswordForm(false)
    } catch (error) {
      console.error(error)
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
      })
    }
  }


  // function to redirect user to the login page.
  // can be used in button clicks.
  const loginPage = () => {
    window.location.href = './login'
  }

  // returning text for handling the loading, errors or if there is no data found
  if (loading) return <p>Loading your profile.</p>
  if (error) return <div> <p> Whoops! You need to be logged in to do that.</p><button onClick={loginPage}> Login</button></div>
  if (!data || !data.me) return <p>Profile not found</p>

  return (
    <div>
      {loggedIn && <p>If you can read this then user is authenticated</p>}

      {!showUserForm && (
        <>
          <h3 className='welcomeText'>Hey there, {userInfo.username}, This is your account information.</h3>
          <div>
            <Box component="section" sx={{ p: 2, border: '3px solid grey' }}>
              <p>Email: {userInfo.email}</p>
              <p>Username: {userInfo.username}</p>
              <p>Location: {userInfo.location}</p>
              <p>Social: {userInfo.socialHandle}</p>
              <p>Bio: {userInfo.bio}</p>
            </Box>
            <button onClick={handleChangeInfo} >Change Account Settings</button>
          </div>
        </>
      )}
      {showUserForm && (
        <form >
          <div className='userEmailDiv'>
            <TextField
              className='userEmail'
              type='text'
              name='email'
              value={userInfo.email}
              onChange={handleInputChange}
              label="Email"
              variant="filled"
            />
          </div>
          <div className='usernameDiv'>
          <TextField
            className='username'
            type='text'
            name='username'
            value={userInfo.username}
            onChange={handleInputChange}
            label="Username"
            variant="filled"
          />
          </div>
          <div>
            <Box className='userLocationDiv'>
              <FormControl variant="filled" className="userLocationBox" >
                <InputLabel id="location-select-label">Location</InputLabel>
                <Select
                  className='userLocation'
                  name='location'
                  value={userInfo.location}
                  label="Location"
                  onChange={handleInputChange}
                >
                  <MenuItem value={""}>Location Not Provided</MenuItem>
                  <MenuItem value={"New York"}>New York</MenuItem>
                  <MenuItem value={"San Francisco"}>San Francisco</MenuItem>
                  <MenuItem value={"Los Angeles"}>Los Angeles</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <div className='userSocialHandleDiv'>
            <TextField
              className='userSocialHandle'
              type='text'
              name='socialHandle'
              value={userInfo.socialHandle}
              onChange={handleInputChange}
              label="Social Handle"
              variant="filled"
            />
          </div>
          <div className='userBioDiv'>
            <TextField
              className='userBio'
              type='text'
              name='bio'
              value={userInfo.bio}
              onChange={handleInputChange}
              label="Bio"
              multiline
              rows={5}
              variant="filled"
            />
          </div>
          {!showPasswordForm && (
            <>
            <div>
            <button onClick={handlePasswordInfo}>Change Password</button>
            </div>
            <button type="button" onClick={handleSaveChange}>Apply</button>
            <button type="button" onClick={() => setShowUserForm(false)} >Done</button>
            </>
          )}
        </form>
      )}
      {showPasswordForm && (
        <form>
          <div className='userPwdDiv'>
            <TextField
              className='userPassword'
              type='password'
              name='password'
              value={userPwdInfo.password}
              onChange={handlePwdChange}
              label="Password"
              variant="filled"
            />
          </div>
          <div className='userConfirmPwdDiv'>
            <TextField
              className='userPassword'
              type='password'
              name='confirmPassword'
              value={userPwdInfo.confirmPassword}
              onChange={handlePwdChange}
              label="Confirm Password"
              variant="filled"
            />
          </div>
          <button type="button" onClick={handleSaveChange}>Apply</button>
          <button type='button' onClick={handleCloseAll}> Done </button>
        </form>
      )}
      <ToastContainer />
      {!removeAcctForm && !showPasswordForm && !showUserForm && (
        <button className='deleteAcctBtn' onClick={handleDeleteForm}> Delete Account</button>
      )}
      {removeAcctForm && !showPasswordForm && !showUserForm &&(
        <div>
        <>
        <p className='confirmDeleteText' >Are you sure you want to delete your account? This is irreversible</p>
        <button className='deleteAcctBtn' type="button" onClick={handleDeleteAcctChange}>Confirm Delete</button>
        <button className='cancelAcctDeleteBtn' type="button" onClick={() => setRemoveAcctForm(false)} >Cancel</button>
        </>
      </div>
      )}
      <p className='dateFormat'>Account created on <DateFormat /> </p>
    </div>
  )
}


export default Account

