import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../../utils/queries';
import Auth from '../../../utils/auth';
import './assets/navBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HiMenu } from 'react-icons/hi'
// import SearchBar from '../SeachBar/SearchBar';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loadingMe) return <p>Loading...please wait</p>;
  if (errorMe) return <p>{errorMe.message}</p>;
  if (!dataMe) return <p>No user data found</p>;

  return (
    <>
      <button className="toggle-button" onClick={toggleSidebar}>
        <HiMenu size={30} />
      </button>
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Live Fit</h2>
          {/* <SearchBar /> */}
        </div>
        <nav className="sidebar-nav">
          <Link to='/about' onClick={() => setIsSidebarOpen(false)}>About</Link>
          <Link to='/' onClick={() => setIsSidebarOpen(false)}>Community</Link>
          <Link to='/create-post' onClick={() => setIsSidebarOpen(false)}>Create Post</Link>
          <Link to='/log-workout' onClick={() => setIsSidebarOpen(false)}>Log Workout</Link>
        </nav>
        <div className="sidebar-user">
          {!loggedIn ? (
            <Button className="sidebar-button" onClick={() => { navigate('./login'), setIsSidebarOpen(false) }}>
              Login
            </Button>
          ) : (
            <div>
              <p className="sidebar-username">🏋️ {uppercaseUserName} 🥇</p>
              <Button
                variant='secondary'
                className="sidebar-button"
                onClick={() => {
                  navigate('./profile'),
                    setIsSidebarOpen(false)
                }}
              >
                Profile
              </Button>
              <Button
                variant='secondary'
                className="sidebar-button"
                onClick={() => {
                  navigate('./account'),
                    setIsSidebarOpen(false)
                }}
              >
                Account
              </Button>
              <Button
                variant='danger'
                className="sidebar-button logoutBtn"
                onClick={() => {
                  setIsSidebarOpen(false),
                    handleLogout()
                }}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
