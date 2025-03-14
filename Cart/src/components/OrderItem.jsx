import React from "react";
import prodimg from "../images/bat.jpg";
import "./OrderItem.css";

const OrderItem = ({ item }) => {
  return (
    <div className="order-item-card border border-dark rounded p-3 m-2 bg-light">
      <div className="d-flex flex-row align-items-center">
        <div className="order-item-image-container">
          <img
            src={item?.imageURL || prodimg}
            alt={item?.productName || "Product"}
            className="img-fluid order-item-image"
          />
        </div>
        <div className="order-item-details ms-3">
          <h5 className="order-item-title">
            {item?.productName || item?.name}
          </h5>
          <h6 className="text-danger">₹{item?.price}</h6>
          <p className="mb-0">Quantity: {item?.quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
