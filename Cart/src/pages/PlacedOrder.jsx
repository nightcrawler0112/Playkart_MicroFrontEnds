import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderItem from "../components/OrderItem";
import { Row, Col } from "react-bootstrap";
const PlacedOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `http://localhost:8082/order/${orderId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setOrder(response.data);
        } catch (error) {
          console.error("Error fetching order details:", error);
          toast.error(
            error.response.data.message || "Error fetching order details"
          );
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const { orderItems, totalPrice } = order;
  const { userName, phoneNumber, address, createdAt } = orderItems[0];

  return (
    <div className="container mt-5">
      <h2>Order Details: </h2>
      <div className="border p-3 mb-3 rounded d-flex justify-content-between bg-light">
        <div>
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{totalPrice}
          </p>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <p>
            <strong>User Name:</strong> {userName}
          </p>
          <p>
            <strong>Phone Number:</strong> {phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> rajnavinraj23@gmail.com
          </p>
        </div>
        <div>
          <p>
            <strong>Shipping Address:</strong>
          </p>
          <p>{address}</p>
        </div>
      </div>
      <h3 className="m-2"> Items:</h3>
      <Row>
        {orderItems.map((item, index) => (
          <Col lg={6} className="mb-4">
            <OrderItem key={index} item={item} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PlacedOrder;
