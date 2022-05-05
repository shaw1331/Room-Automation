import React, { useState, useContext } from "react";

import Device from "./Device";

import classes from "./ProfileForm.module.css";
import AuthContext from "../../store/auth-context";
import axios from "axios";

const ProfileForm = (props) => {
  const authCtx = useContext(AuthContext);
  const [devices, setDevices] = useState([]);
  const [state, setState] = useState(true);

  function getData() {
    setState(true);
  }

  const token = authCtx.token;
  if (state) {
    axios({
      method: "GET",
      url: "https://api.sinric.pro/api/v1/devices/",
      headers: {
        Authorization: "Bearer " + [token],
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(function (response) {
      setDevices(response.data.devices);
      setState(false);
    });
  }

  return (
    <div className={classes.control}>
      {devices.map((device) => {
        return (
          <Device
            key={device.id}
            id={device.id}
            getData={getData}
            title={device.name}
            state={device.powerState}
            isOnline={device.isOnline}
          />
        );
      })}
    </div>
  );
};

export default ProfileForm;
