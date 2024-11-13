import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { QUERY_ME } from '../../../utils/queries';
import Auth from '../../../utils/auth';
import './assets/navBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from '../SeachBar/SearchBar';



const NavBar = () => {
  const loggedIn = Auth.loggedIn();

  const { loading: loadingMe, data: dataMe, error: errorMe } = useQuery(QUERY_ME);


  const [userInitial, setUserInitial] = useState({ username: '' });


  useEffect(() => {
    if (loggedIn && dataMe) {
      setUserInitial({
        ...userInitial,
        username: dataMe.me.username,
      });
    }
  }, [dataMe, loggedIn]);


  const uppercaseUserName = userInitial.username.toUpperCase();

  const handleLogout = () => {
    Auth.logout();
  };

  const handleLoginPage = () => {
    window.location.href = './login';
  };

  const handleProfilePage = () => {
    window.location.href = './profile';
  };

  const handleAccountPage = () => {
    window.location.href = './account';
  };



  if (loadingMe) return <p>Loading...please wait</p>;
  if (errorMe) return <p>{errorMe.message}</p>;
  if (!dataMe) return <p>No user data found</p>;


  return (
    <Navbar bg="dark" expand="lg" variant="dark" className="header">
      <Container>

        <Navbar.Brand href="/" className="font-weight-bold text-uppercase" style={{ fontFamily: 'times new roman' }}>
          Live Fit
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <SearchBar />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto navBarLink">
            <Link className="navBarLinkAbout" to='/about'>About</Link>
            <Link className="navBarLinkCommunity" to='/'>Community</Link>
            <Link className="navBarLinkCreatePost" to='/create-post'>Create Post</Link>
            <Link className="navBarLinkLogWorkout" to='/log-workout'>Log Workout</Link>
          </Nav>
          <Nav>
            {/* <OverlayTrigger overlay={<Tooltip>Open settings</Tooltip>}> */}
            <Dropdown align="end">
              <Dropdown.Toggle
                className="p-0"
                style={{ backgroundColor: '#f9bf00c5', color: 'white', border: 'none', width: '160px', height: '120%' }}>
                {!loggedIn ? 'Member Access' : uppercaseUserName}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ width: '10%' }} >
                {!loggedIn && <Dropdown.Item onClick={handleLoginPage}>Login</Dropdown.Item>}
                {loggedIn &&
                  <>
                    <Dropdown.Item style={{ display: 'flex', marginRight: '10px' }} onClick={handleProfilePage}>Profile</Dropdown.Item>
                    <Dropdown.Item onClick={handleAccountPage}>Account</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout} className="logoutBtn">Logout</Dropdown.Item>
                  </>
                }
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
};

export default NavBar;
