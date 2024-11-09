import { Navbar, Nav, NavDropdown, Container, Button, Tooltip, OverlayTrigger, Dropdown } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { QUERY_ME } from '../../../utils/queries';
import Auth from '../../../utils/auth';
import './assets/navBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';


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

  const handleCreatePostPage = () => {
    window.location.href = './create-post';
  };

  const handleLogWorkoutPage = () => {
    window.location.href = './log-workout';
  };

  const handleHomePage = () => {
    window.location.href = './';
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
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto navBarLink">
            <Nav.Link className="navBarLink" onClick={handleHomePage}>Community</Nav.Link>
            <Nav.Link className="navBarLink" onClick={handleCreatePostPage}>Create Post</Nav.Link>
            <Nav.Link className="navBarLink" onClick={handleLogWorkoutPage}>Log Workout</Nav.Link>
          </Nav>
          <Nav>
            <OverlayTrigger overlay={<Tooltip>Open settings</Tooltip>}>
              <Dropdown align="end">
                <Dropdown.Toggle className="p-0" style={{ backgroundColor: '#f9c000', color: 'white', border: 'none', width: '110%', height: '120%' }}>

                  {!loggedIn ? 'Member Access' : uppercaseUserName}

                  {/* {loggedIn ? (
                    <img
                      src="/static/images/avatar/2.jpg"
                      alt={uppercaseUserName}
                      className="rounded-circle"
                      style={{ width: '40px', height: '40px' }}
                    />
                  ) : (
                    <img
                      src="/static/images/avatar/2.jpg"
                      className="rounded-circle"
                      style={{ width: '40px', height: '40px' }}
                      alt="Avatar"
                    />
                  )} */}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {!loggedIn && <Dropdown.Item onClick={handleLoginPage}>Login</Dropdown.Item>}
                  {loggedIn &&
                    <>
                      <Dropdown.Item onClick={handleProfilePage}>Profile</Dropdown.Item>
                      <Dropdown.Item onClick={handleAccountPage}>Account</Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout} className="logoutBtn">Logout</Dropdown.Item>
                    </>
                  }
                </Dropdown.Menu>
              </Dropdown>
            </OverlayTrigger>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
