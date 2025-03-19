import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./header.css";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <>
      <Container
        fluid
        className="bg-dark custom-strip text-white d-flex justify-content-center align-items-center"
      >
        <div className="p-2"> WELCOME TO PLAYKART!!! </div>
      </Container>
      <Navbar />
      <hr className="m-0 p-0" />
    </>
  );
};

export default Header;
