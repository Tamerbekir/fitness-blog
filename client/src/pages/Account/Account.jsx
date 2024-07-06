import Auth from '../../../utils/auth'
import { useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { UPDATE_PROFILE } from '../../../utils/mutations'
import { QUERY_ME } from '../../../utils/queries'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './assets/account.css'
// import { Input } from '@mui/material'
import TextField from '@mui/material/TextField';
import { DateFormat } from '../../components/index'



const Account = () => {

  //Used to ensure user is logged in during development purposes only
  const loggedIn = Auth.loggedIn()
  // setting up loading, error and data are the variables when querying the user me details 
  const { loading, error, data } = useQuery(QUERY_ME)
  // using the UPDATE PROFILE mutation to update users info
  const [updateProfile] = useMutation(UPDATE_PROFILE)
  // setting up a useState for showing the form when clicked 
  const [showUserForm, setShowUserForm] = useState(false)
  const [showPasswordForm, setPasswordForm] = useState(false)

  // setting up the useState for the user and the info that will be used when changing their settings. Empty strings. This useState will be used with the useEffect below as well as taking in whatever the user types in
  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
    location: '',
    socialHandle: '',
    bio: ''
  })

  const [userPwdInfo, setUserPwdInfo] = useState({
    password: '',
    confirmPassword: ''
  })


  // useEffect for placing pre existing userInfo IN SIDE of the empty strings in the useState above (userInfo, setUserInfo).
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

  // handling the useState for handling the userInfo. 
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setUserInfo({
      ...userInfo,
      [name]: value
    })
  }

  const handlePwdChange = (event) => {
    const { name, value } = event.target
    setUserPwdInfo({
      ...userPwdInfo,
      [name]: value
    })
  }

  const handleChangeInfo = () => {
    setShowUserForm(true)
  }

  const handlePasswordInfo = () => {
    setPasswordForm(true)
  }


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

    try {
      const { data: updateUserInfo } = await updateProfile({
        variables: {
          ...userInfo,
          username: userInfo.username || data.me.username,
          email: userInfo.email || data.me.email,
          password: userPwdInfo.password || data.me.password,
          confirmPassword: userPwdInfo.confirmPassword || data.me.confirmPassword,
          bio: userInfo.bio || data.me.bio,
          socialHandle: userInfo.socialHandle || data.me.socialHandle,
          location: userInfo.location || data.me.location,
        }
      })
      toast.success('Saved', {
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
      setShowUserForm(false)
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



  if (loading) return <p>Loading your profile.</p>
  if (error) return <div> <p> Whoops! You need to be logged in to do that.</p><button onClick={loginPage}> Login</button></div>
  if (!data || !data.me) return <p>Profile not found</p>

  return (
    <div>
      {loggedIn && <p>If you can read this then user is authenticated</p>}

      {!showUserForm && (
        <>
          <h3 className='welcomeText'>Hey there, {userInfo.username}, This is your account information.</h3>
          <p>Email: {userInfo.email}</p>
          <p>Username: {userInfo.username}</p>
          <p>Location: {userInfo.location}</p>
          <p>Social: {userInfo.socialHandle}</p>
          <p>Bio: {userInfo.bio}</p>
          <button onClick={handleChangeInfo} >Change Account Settings</button>
        </>
      )}


      {showUserForm && (
        <form>
          <div>
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
          <TextField
            className='username'
            type='text'
            name='username'
            value={userInfo.username}
            onChange={handleInputChange}
            label="Username"
            variant="filled"
          />
          <div>
            <TextField
              className='userLocation'
              type="text"
              name='location'
              value={userInfo.location}
              onChange={handleInputChange}
              label="Location"
              variant="filled"
            />
          </div>
          <div>
            <TextField
              className='userSocialHandle'
              type='text'
              name='socialHandle'
              value={userInfo.socialHandle}
              onChange={handleInputChange}
              label="Social"
              variant="filled"
            />
          </div>
          <div>
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
          <button type="button" onClick={handleSaveChange}>Save</button>
          <button type="button" onClick={() => setShowUserForm(false)} >Cancel</button>
        </form>
      )}

      {showPasswordForm && (
        <form>
          <div>
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
          <div>
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

          <button type="button" onClick={handleSaveChange}>Save</button>
          <button type="button" onClick={() => setPasswordForm(false)} >Cancel</button>
        </form>

      )}

      {!showPasswordForm && (
        <button onClick={handlePasswordInfo}>Change Password</button>
      )}

      <ToastContainer />
      <p className='dateFormat'>Account created on <DateFormat /> </p>
    </div>
  )
}


export default Account

