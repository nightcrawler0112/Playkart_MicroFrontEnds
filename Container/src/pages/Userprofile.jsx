import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MdEdit } from "react-icons/md";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressBook from "../components/AddressBook";
import { BsFillBagCheckFill } from "react-icons/bs";
import "./Userprofile.css";
import userimg from "../images/userinfo.jpg";

const Userprofile = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [userView, setUserView] = useState("Personal Information");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setIsAdmin(decodedToken.isAdmin);
          console.log("Is Admin:", decodedToken.isAdmin);

          const response = await axios.get(
            "http://localhost:8080/user/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data);
          console.log("User profile:", response.data);
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const getUserInfo = () => {
    setUserView("Personal Information");
  };

  const getOrders = async () => {
    setUserView("My Orders");
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("http://localhost:8082/order/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        console.log("User orders:", response.data);
      } catch (err) {
        console.error("Error fetching user orders:", err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setUser({});
    setOrders([]);
    setUserView("Personal Information");
    console.log("User logged out");
    navigate("/");
  };

  const handleEditClick = (field) => {
    if (field === "personal") {
      setEditData({
        field,
        value: { name: user.name || "", phoneNumber: user.phoneNumber || "" },
      });
    } else if (field === "login") {
      setEditData({
        field,
        value: { oldPassword: "", newPassword: "" },
      });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setValidationMessage("");
    setConfirmPassword("");
  };

  const handleModalSave = async () => {
    if (
      editData.field === "login" &&
      editData.value.newPassword !== confirmPassword
    ) {
      setValidationMessage("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.patch(
          `http://localhost:8080/user/`,
          editData.value,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        console.log("Updated user profile:", response.data);
        toast.success("Profile updated successfully!");
        setShowModal(false);
      } catch (err) {
        console.error("Error updating user profile:", err.response.data);
        toast.error(
          err.response.data.message ||
            err.response.data.newPassword ||
            err.response.data.phoneNumber ||
            "Error updating profile."
        );
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      value: { ...prevData.value, [name]: value },
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const adminFunctionalities = () => {
    navigate("/admin");
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <ToastContainer />
      <div className="d-flex flex-row gap-5 ">
        <div className="border border-dark rounded d-flex flex-column w-25 h-50 m-4 p-4 bg-white">
          <div role="button" onClick={getUserInfo}>
            <b className="m-4">Personal Information</b>
            <FaArrowRightLong />
          </div>
          <hr></hr>
          <div role="button" onClick={getOrders}>
            <b className="m-4">My Orders</b>
            <FaArrowRightLong />
          </div>
          <hr></hr>
          <div role="button" onClick={() => setUserView("Address Book")}>
            <b className="m-4 ">Address Book</b>
            <FaArrowRightLong />
          </div>
          <hr></hr>
          <div role="button" onClick={handleLogout}>
            <b className="m-4">Log Out</b>
            <FaArrowRightLong />
          </div>
          {isAdmin && (
            <>
              <hr></hr>
              <div role="button" onClick={adminFunctionalities}>
                <b className="m-4">Admin Functionalities</b>
                <FaArrowRightLong />
              </div>
            </>
          )}
        </div>
        <div className="m-4 p-4 border border-dark rounded d-flex flex-column justify-content-center w-50 bg-white">
          {userView === "Personal Information" && (
            <>
              <div className="fs-2 justify-content-center align-items-center text-center d-flex flex-column">
                <b>My Details</b>
                <img
                  src={userimg}
                  className="user-img justify-content-center"
                  alt="user"
                ></img>
              </div>
              <p className="m-2 mb-4 text-center">
                Feel Free to edit any of the details so your account details are
                up to date.
              </p>
              <div className="d-flex gap-3 align-items-center">
                <p className="fs-4 p-1 mt-3">
                  <b>Personal Details</b>
                </p>
                <MdEdit
                  role="button"
                  size={25}
                  onClick={() => handleEditClick("personal")}
                />
              </div>

              <div className="m-2 border border-dark rounded bg-light">
                <p className="m-2">
                  <b>Name:</b> {user?.name}
                </p>
                <p className="m-2">
                  <b>Phone:</b> {user?.phoneNumber}
                </p>
                <p className="m-2">
                  <b>Gender:</b> Male
                </p>
              </div>
              <div className="d-flex gap-3 align-items-center">
                <p className="fs-4 p-2 mt-3">
                  <b>Login Details</b>
                </p>
                <MdEdit
                  role="button"
                  size={25}
                  onClick={() => handleEditClick("login")}
                />
              </div>
              <div className="m-2 border border-dark rounded bg-light">
                <p className="m-2">
                  <b>Email:</b> {user?.email}
                </p>
                <p className="m-2">
                  <b>Password:</b> ********
                </p>
              </div>
            </>
          )}
          {userView === "My Orders" && (
            <>
              <div className="m-4 fs-2 justify-content-center text-center">
                <b>My Orders </b>
              </div>
              <div className="m-4">
                {orders.map((order, index) => {
                  let orderDate = "Not available";
                  if (
                    order.orderItems &&
                    order.orderItems.length > 0 &&
                    order.orderItems[0].createdAt
                  ) {
                    orderDate = new Date(
                      order.orderItems[0].createdAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }

                  return (
                    <div
                      key={index}
                      className="border rounded p-3 mb-3 bg-light d-flex justify-content-around align-items-center"
                      onClick={() => navigate(`/order/${order.orderId}`)}
                    >
                      <div className="col-2 d-flex justify-content-center align-items-center">
                        <BsFillBagCheckFill size={45} />
                      </div>
                      <div className="col-5">
                        <p>
                          <b>Order ID:</b> {order?.orderId}
                        </p>
                        <p>
                          <b>Price:</b> ₹{order?.totalPrice}
                        </p>
                        <p>
                          <b>Order Date:</b> {orderDate}
                        </p>
                      </div>
                      <div className="col-5">
                        <p>
                          <b>User Name:</b>{" "}
                          {order?.orderItems[0]?.userName || "N/A"}
                        </p>
                        <p>
                          <b>Phone: </b>{" "}
                          {order?.orderItems[0]?.phoneNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {userView === "Address Book" && <AddressBook />}
        </div>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editData.field === "personal"
              ? "Edit Personal Details"
              : "Edit Password"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {editData.field === "personal" ? (
              <>
                <Form.Group controlId="formEditName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editData.value.name || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formEditPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={editData.value.phoneNumber || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group controlId="formEditOldPassword">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="oldPassword"
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formEditNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formEditConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </Form.Group>
                <Button
                  variant="link"
                  onClick={toggleShowPassword}
                  className="p-0"
                ></Button>
                {validationMessage && (
                  <div className="text-danger mt-2">{validationMessage}</div>
                )}
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="dark" onClick={handleModalSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Userprofile;
