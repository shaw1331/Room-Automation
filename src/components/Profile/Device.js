import React, { useContext } from "react";
import classes from "./Device.module.css";
import AuthContext from "../../store/auth-context";
import axios from "axios";

function Device(props) {
  var online = props.isOnline;
  const [status, setStatus] = React.useState(props.state);
  const authCtx = useContext(AuthContext);

  function handleClick(event) {
    let Url;
    const token = authCtx.token;
    const value = event.target.value;
    const name = event.target.name;
    if (online) {
      if (value === "On") {
        Url =
          "https://api.sinric.pro/api/v1/devices/" +
          name +
          '/action?clientId=android-app&type=request&createdAt=1550493108338&action=setPowerState&value={"state": "On"}';
        setStatus("On");
      } else if (value === "Off") {
        Url =
          "https://api.sinric.pro/api/v1/devices/" +
          name +
          '/action?clientId=android-app&type=request&createdAt=1550493108338&action=setPowerState&value={"state": "Off"}';
        setStatus("Off");
      }

      axios({
        method: "GET",
        url: Url,
        headers: {
          Authorization: "Bearer " + [token],
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then(function (response) {
        if (response.status === 200) {
          const message = "Turned " + value + " device.";

          alert(message);
        }
      });
    } else {
      alert("Devices are offline");
    }
  }

  return (
    <div className={classes.dev}>
      <img src="/image/device.jpg" alt="device"></img>
      <h1>{props.title}</h1>
      {status === "On" ? (
        <p style={{ color: "green" }}>Switch is On</p>
      ) : (
        <p style={{ color: "red" }}>Switch is Off</p>
      )}

      {online ? (
        <p style={{ color: "green" }}>Device is Online</p>
      ) : (
        <p style={{ color: "red" }}>Device is Offline</p>
      )}
      <p>Device Id : {props.id}</p>
      <div className={classes.devBtn}>
        <button value="On" name={props.id} onClick={handleClick}>
          Turn On
        </button>
        <button value="Off" name={props.id} onClick={handleClick}>
          Turn Off
        </button>
      </div>
    </div>
  );
}
export default Device;
