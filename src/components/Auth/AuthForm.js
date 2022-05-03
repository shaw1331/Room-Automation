import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import MailLockIcon from "@mui/icons-material/MailLock";
import KeyIcon from "@mui/icons-material/Key";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  function submitHandler(event) {
    event.preventDefault();

    let Url;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (isLogin) {
      Url = "https://api.sinric.pro/api/v1/auth";
      const auth =
        "Basic " +
        new Buffer.from(enteredEmail + ":" + enteredPassword).toString(
          "base64"
        );
      axios({
        method: "POST",
        url: Url,
        headers: {
          Authorization: auth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
          client_id: "android-app",
        },
      }).then(function (response) {
        const Data = response.data;
        console.log(Data);
        const expirationTime = new Date(
          new Date().getTime() + +Data.expiresIn * 1000
        );
        console.log(expirationTime);
        authCtx.login(Data.accessToken, expirationTime);
        history.replace("/");
      });
    } else {
      Url = "https://api.sinric.pro/api/v1/auth";
      axios({
        method: "POST",
        url: Url,
        headers: {
          "x-sinric-api-key": enteredPassword,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
          client_id: "android-app",
        },
      }).then(function (response) {
        const Data = response.data;
        console.log(Data);
        const expirationTime = new Date(
          new Date().getTime() + +Data.expiresIn * 1000
        );
        console.log(expirationTime);
        authCtx.login(Data.accessToken, expirationTime);
        history.replace("/");
      });
    }
  }

  return (
    <section className={classes.auth}>
      <h1>Login</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <div className={classes.divIcon}>
            <MailLockIcon className={classes.icon} sx={{ fontSize: 40 }} />
            <input
              type="email"
              id="email"
              required
              ref={emailInputRef}
              autoComplete="off"
            />
          </div>
        </div>
        <div className={classes.control}>
          <label htmlFor="password"> {isLogin ? "Password" : "API Key"}</label>
          <div className={classes.divIcon}>
            <KeyIcon className={classes.icon} sx={{ fontSize: 40 }} />
            <input
              type="password"
              id="password"
              required
              ref={passwordInputRef}
            />
          </div>
        </div>
        <div className={classes.actions}>
          <button>Login</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Login With API key" : "Login with Credential"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
