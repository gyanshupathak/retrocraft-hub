import React , {useState} from 'react';
import { NavLink , useNavigate} from 'react-router-dom'; // If you are using React Router
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const handleLogout = () => {
    // Remove the JWT from local storage
    localStorage.removeItem('jwtToken');

    // Update the state to reflect that the user is logged out
    setIsAuthenticated(false);

    // Redirect the user to the login page or any other page
    navigate('/login'); // Replace '/login' with the appropriate path
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_inner}>
        <div className={styles.logo}>
          RetroCraft Hub
        </div>
        <ul className={styles.nav_links}>
          <li>
            <NavLink to="/dashboardproducer" activeclassname={styles.active}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/people" activeclassname={styles.active}>People</NavLink>
          </li>
          <li>
            <NavLink to="/profileproducer" activeclassname={styles.active}>Profile</NavLink>
          </li>
          <li className={styles.notification_icon}>
            <span role="img" aria-label="Notification Icon">
              🔔
            </span>
          </li>
          <li className={styles.notification_icon}>
            <button className={styles.logoutButton}  onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
