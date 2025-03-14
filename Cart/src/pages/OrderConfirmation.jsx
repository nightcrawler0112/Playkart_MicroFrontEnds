import React from "react";
import confirmed from "../images/confirmed.png";
import orderPlaced from "../images/order_placed_bg.jpg";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const backgroundStyle = {
    backgroundImage: `url(${orderPlaced})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      className="order-background d-flex flex-column align-items-center justify-content-center"
      style={backgroundStyle}
    >
      <div className="dark-overlay"></div>

      <div className="content-card bg-white rounded-lg shadow-lg p-5 m-4 text-center">
        <div className="text-center mb-4">
          <img
            src={confirmed}
            alt="Confirmed"
            className="img-fluid confirmation-image mb-4"
          />
        </div>

        <h2 className="text-success fw-bold mb-3">
          Order Placed Successfully!
        </h2>
        <p className="text-muted mb-4">Thank you for your purchase!</p>

        <div className="d-grid gap-2">
          <a href="/" className="btn btn-outline-secondary bg-dark text-white">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
