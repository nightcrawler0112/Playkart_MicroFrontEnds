import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddressBook = () => {
  const [address, setAddress] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [validationMessages, setValidationMessages] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchUserAddress = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:8080/user/address/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAddress(response.data);
        } catch (err) {
          console.error("Error fetching user address:", err);
        }
      }
    };

    fetchUserAddress();
  }, []);

  const handleAddAddressClick = () => {
    setIsAddingAddress(true);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsAddingAddress(false);
    setValidationMessages({
      street: "",
      city: "",
      state: "",
      zipCode: "",
    });
  };

  const handleModalSave = async () => {
    const { street, city, state, zipCode } = newAddress;
    const newValidationMessages = {
      street: street ? "" : "Street is required",
      city: city ? "" : "City is required",
      state: state ? "" : "State is required",
      zipCode: zipCode ? "" : "Zip Code is required",
    };

    setValidationMessages(newValidationMessages);

    if (Object.values(newValidationMessages).some((msg) => msg !== "")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        if (isAddingAddress) {
          const response = await axios.post(
            `http://localhost:8080/user/address/`,
            newAddress,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAddress([...address, response.data]);
          toast.success("Address added successfully!");
        }
        setShowModal(false);
      } catch (err) {
        console.error("Error adding new address:", err);
        toast.error(err.response.data.message || "Error adding address.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const deleteAddress = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/user/address/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAddress(address.filter((addr) => addr.id !== id));
        toast.success("Address deleted successfully!");
      } catch (err) {
        console.error("Error deleting address:", err);
        toast.error("Error deleting address.");
      }
    }
  };

  return (
    <div>
      <div className="pb-5">
        <h3 className="m-3">MY ADDRESSES :</h3>
        {address.length === 0 ? (
          <div className="m-4 fs-5 p-3">No addresses found</div>
        ) : (
          <div className="m-4">
            {address.map((addr, index) => (
              <div key={index}>
                <hr />
                <div className="d-flex flex-row justify-content-between">
                  <h5>
                    Address {index + 1} : {addr.street}, {addr.city},{" "}
                    {addr.state}, {addr.zipCode}
                  </h5>
                  <MdDelete
                    role="button"
                    size={28}
                    onClick={() => deleteAddress(addr.id)}
                  />
                </div>
                <hr />
              </div>
            ))}
          </div>
        )}

        <div className="w-25">
          <Button
            className="w-25 position-absolute"
            variant="dark m-4"
            onClick={handleAddAddressClick}
          >
            Add New Address
          </Button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAddStreet">
              <Form.Label>
                <b>Street *</b>
              </Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                isInvalid={!!validationMessages.street}
              />
              <Form.Control.Feedback type="invalid">
                {validationMessages.street}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formAddCity">
              <Form.Label>
                <b>City *</b>
              </Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                isInvalid={!!validationMessages.city}
              />
              <Form.Control.Feedback type="invalid">
                {validationMessages.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formAddState">
              <Form.Label>
                <b>State *</b>
              </Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={newAddress.state}
                onChange={handleInputChange}
                isInvalid={!!validationMessages.state}
              />
              <Form.Control.Feedback type="invalid">
                {validationMessages.state}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formAddZipCode">
              <Form.Label>
                <b>Zip Code *</b>
              </Form.Label>
              <Form.Control
                type="text"
                name="zipCode"
                value={newAddress.zipCode}
                onChange={handleInputChange}
                isInvalid={!!validationMessages.zipCode}
              />
              <Form.Control.Feedback type="invalid">
                {validationMessages.zipCode}
              </Form.Control.Feedback>
            </Form.Group>
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

export default AddressBook;
