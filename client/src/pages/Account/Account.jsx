import Auth from '../../../utils/auth'
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_PROFILE } from '../../../utils/mutations'
import { QUERY_ME } from '../../../utils/queries'

const Account = () => {

  const loggedIn = Auth.loggedIn()

  const { loading, error, data } = useQuery(QUERY_ME)

  const loginPage = () => {
    window.location.href = "./login"
  }

  const handleChangeInfo = () => {
    alert('cant do that let')
  }

  if (loading) return <p>Loading your profile.</p>
  if (error) return <div> <p> Whoops! You need to be logged in to do that.</p><button onClick={loginPage}> Login</button></div>
  if (!data || !data.me) return <p>Profile not found</p>

  const email = data.me.email
  const username = data.me.username
  const password = data.me.password
  const location = data.me.location
  const socialHandle = data.me.socialHandle
  const bio = data.me.bio
  // console.table(data.me.favoritePost)

  
  
  return (
    <div>
      {loggedIn && <p>if you can read this then user is Authenticated</p>}
      <h3> Hey there, {username}. This is your account information.</h3>
      <p>My email is your email: {email}</p>
      <button onClick={handleChangeInfo} >Change Username</button>
      <p>This is your username: {username}</p>
      <button onClick={handleChangeInfo} >Change Email</button>
      <p>Change your password</p>
      <button onClick={handleChangeInfo} >Change Password</button>
      <p>From: {location}</p>
      <button onClick={handleChangeInfo} >Change location</button>
      <p>Social: {socialHandle}</p>
      <button onClick={handleChangeInfo} >Change social handle</button>
      <p>Bio: {bio}</p>
      <button onClick={handleChangeInfo} >Change bio</button>
    </div>
  )
}

export default Account