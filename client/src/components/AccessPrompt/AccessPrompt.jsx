import { useNavigate } from 'react-router-dom'
import { QUERY_ME } from '../../../utils/queries/'
import Button from 'react-bootstrap/Button'
import './assets/accessPrompt.css'
import { useQuery } from '@apollo/client'
import Auth from '../../../utils/auth'

export default function AccessPrompt() {

  const { loading, data, error } = useQuery(QUERY_ME)

  const navigate = useNavigate()

  const loggedIn = Auth.loggedIn()

  const login = () => {
    navigate('/login')
  }

  const signUp = () => {
    navigate('/signup')
  }

  if (loading) return (<p>Please wait...</p>)
  if (error) return (<p>There was an error</p>)
  if (!loggedIn || !data.me) {
    return (
      <div className="signInOrSignupDiv">
        <p>
          Be sure to <Button className='loginBtn' onClick={login}> Login </Button>
          or
          <Button className='signUpBtn' onClick={signUp}> Sign Up </Button> here.
        </p>
      </div>
    )
  }
}