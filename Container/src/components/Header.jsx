import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./header.css";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <>
      <Container fluid className="bg-dark custom-strip text-white text-center">
        <div className="p-2"> EXTRA 10% OFF ON SIGNUP </div>
      </Container>
      <Navbar />
      <hr className="m-0 p-0" />
    </>
  );
};

export default Header;
