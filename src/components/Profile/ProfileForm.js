import React from "react";

import Device from "./Device";

import classes from "./ProfileForm.module.css";

const ProfileForm = (props) => {
  const devices = props.devices;

  return (
    <div className={classes.control}>
      {devices.map((device) => {
        return (
          <Device
            key={device.id}
            id={device.id}
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
