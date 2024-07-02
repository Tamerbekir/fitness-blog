import Auth from '../../utils/auth';


const Home = () => {
  //created variable for if user is logged in, using Auth and loggedIn Method
  const loggedIn = Auth.loggedIn();

  return (
    <div>
      {loggedIn && <p>If you can read this, user is logged in using Auth</p>}
      <h1>This is just a super generic homepage...for now</h1>
    </div>
  )
}

export default Home