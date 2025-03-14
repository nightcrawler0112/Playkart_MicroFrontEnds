import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginimage from "../images/login-background.jpg";
import { Form, Button } from "react-bootstrap";
import Logo from "../images/logo.png";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        email,
        password,
      });
      const token = response.data.token;
      console.log("Token:", token);
      login(token);
      toast.success("Login successful!", {
        autoClose: 3000,
      });
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage =
        "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="d-flex vh-100">
      <div className="col-6 ">
        <img src={loginimage} alt="background" className="w-100 h-100 " />
      </div>
      <div className="col-6 d-flex flex-column align-items-center justify-content-center">
        <div className="border border-dark d-flex align-items-center flex-column bg-light rounded">
          <img src={Logo} alt="Playkart" className="w-25 m-2 p-2 mt-4" />
          <Form onSubmit={handleSubmit} className="w-75 m-2 p-2">
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>
                <b>Email</b>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>
                <b>Password</b>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {error && <div className="text-danger mb-3">{error}</div>}

            <Button variant="secondary" type="submit" className="w-100">
              Login
            </Button>

            <div className="d-flex m-2 mt-4">
              <h6>Not a Member?</h6>
              <a href="/signup" className="ms-2">
                <b>Sign Up</b>
              </a>
            </div>
          </Form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
