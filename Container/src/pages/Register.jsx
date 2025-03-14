import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginimage from "../images/login-background.jpg";
import { Form, Button } from "react-bootstrap";
import Logo from "../images/logo.png";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/user/register", {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
      });
      const token = response.data.body.token;
      console.log("Token:", token);
      login(token);
      toast.success("Registration successful!", {
        autoClose: 3000,
      });
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.password ||
        err.response?.data?.phoneNumber ||
        err.response?.data?.email ||
        "Registration failed. Please check your details and try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="d-flex vh-100">
      <div className="w-50">
        <img
          src={loginimage}
          alt="background"
          className="w-100 h-100 m-0 p-0"
        />
      </div>
      <div className="w-50 d-flex flex-column align-items-center justify-content-center">
        <div className="border border-dark d-flex align-items-center flex-column bg-light rounded w-75">
          <img src={Logo} alt="Playkart" className="w-25 p-2 mt-4" />
          <Form onSubmit={handleSubmit} className="w-75 m-2 p-2">
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>
                <b>Name</b>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPhoneNumber" className="mb-3">
              <Form.Label>
                <b>Phone Number</b>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>
                <b>Email</b>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>
                <b>Password</b>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            {error && <div className="text-danger mb-3">{error}</div>}

            <Button variant="secondary" type="submit" className="w-100">
              Register
            </Button>

            <div className="d-flex m-2 mt-4">
              <h6>Already a Member?</h6>
              <a href="/login" className="ms-2">
                <b>Login</b>
              </a>
            </div>
          </Form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
