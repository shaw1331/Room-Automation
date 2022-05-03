import { useState, useContext } from "react";
import ProfileForm from "./ProfileForm";
import classes from "./UserProfile.module.css";
import AuthContext from "../../store/auth-context";
import axios from "axios";

const UserProfile = () => {
  const authCtx = useContext(AuthContext);
  const [devices, setDevices] = useState([]);
  const token = authCtx.token;
  function clickHandler() {
    axios({
      method: "GET",
      url: "https://api.sinric.pro/api/v1/devices/",
      headers: {
        Authorization: "Bearer " + [token],
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(function (response) {
      setDevices(response.data.devices);
    });
  }
  return (
    <section className={classes.profile}>
      <h2>DashBoard</h2>
      <button onClick={clickHandler}>Get Devices</button>
      <ProfileForm devices={devices} />
    </section>
  );
};

export default UserProfile;
