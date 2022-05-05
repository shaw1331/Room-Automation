import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import Swal from "sweetalert2";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import MailLockIcon from "@mui/icons-material/MailLock";
import KeyIcon from "@mui/icons-material/Key";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [eye, setEye] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  function handleEyeClick() {
    setEye(false);
  }
  function handleEyeOffClick() {
    setEye(true);
  }
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
      })
        .then(function (response) {
          const Data = response.data;

          const expirationTime = new Date(
            new Date().getTime() + +Data.expiresIn * 10
          );
          authCtx.login(Data.accessToken, expirationTime);
          history.replace("/");
        })
        .catch(function (error) {
          // handle error
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Wrong Email or Password.",
          });
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
      })
        .then(function (response) {
          const Data = response.data;
          console.log(Data);
          const expirationTime = new Date(
            new Date().getTime() + +Data.expiresIn * 10
          );
          authCtx.login(Data.accessToken, expirationTime);
          history.replace("/");
        })
        .catch(function (error) {
          // handle error
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Wrong Email or Api key.",
          });
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
              type={eye ? "password" : "text"}
              id="password"
              required
              ref={passwordInputRef}
            />
          </div>
          {eye ? (
            <RemoveRedEyeIcon
              onClick={handleEyeClick}
              className={classes.eye}
              sx={{ fontSize: 30 }}
            />
          ) : (
            <VisibilityOffIcon
              onClick={handleEyeOffClick}
              className={classes.eye}
              sx={{ fontSize: 30 }}
            />
          )}
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
