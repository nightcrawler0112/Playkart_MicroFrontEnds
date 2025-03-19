import React from "react";
import serverdownimg from "../images/sad-image.jpg";

const ServerDown = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center m-2 p-2">
      <p className="fs-2">
        <b>Its not you , it's us !!</b>😭😭😭{" "}
      </p>
      <img src={serverdownimg} className="w-50 h-50" alt="Server Down" />
    </div>
  );
};

export default ServerDown;
