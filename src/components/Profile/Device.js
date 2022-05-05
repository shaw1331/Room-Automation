import React, { useContext } from "react";
import classes from "./Device.module.css";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import Swal from "sweetalert2";

function Device(props) {
  var online = props.isOnline;

  const [status, setStatus] = React.useState(props.state);
  const authCtx = useContext(AuthContext);

  function handleClick(event) {
    props.getData();
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

          Swal.fire({
            position: "center",
            icon: "success",
            title: [message],
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    } else {
      //alert("Devices are offline");
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Devices are offline",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  return (
    <div className={classes.dev}>
      <img src="/image/device.jpg" alt="device"></img>
      <h1>{props.title}</h1>
      <div className={classes.divSpan}>
        {status === "On" ? (
          <span style={{ color: "white", backgroundColor: "green" }}>
            Switch is On
          </span>
        ) : (
          <span style={{ color: "white", backgroundColor: "red" }}>
            Switch is Off
          </span>
        )}

        {online ? (
          <span style={{ color: "white", backgroundColor: "green" }}>
            Device is Online
          </span>
        ) : (
          <span style={{ color: "white", backgroundColor: "red" }}>
            Device is Offline
          </span>
        )}
      </div>

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
