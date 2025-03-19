import React from "react";
import unauthorizedimg from "../images/unauthorized-error.png";
import "./UnauthorizedAccess.css";

const UnauthorizedAccess = () => {
  return (
    <div className="unauthorized-container d-flex justify-content-center align-items-center">
      <img
        src={unauthorizedimg}
        className="unauthorized-image"
        alt="Unauthorized Access"
      />
    </div>
  );
};

export default UnauthorizedAccess;
