import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logOut();
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>
          <img className={classes.Img} src="/image/logo3.png" alt="logo"></img>
          Room Automation
        </div>
      </Link>
      <nav>
        <ul>
          <li>
            <button>
              <Link to="/">Home</Link>
            </button>
          </li>

          {!isLoggedIn && (
            <li>
              <button>
                <Link to="/auth">Login</Link>
              </button>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button>
                <Link to="/profile">DashBoard</Link>
              </button>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
