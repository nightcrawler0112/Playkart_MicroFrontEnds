import React from "react";
import { Button } from "react-bootstrap";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ totalPrice }) => {
  const navigate = useNavigate();

  const placeOrder = () => {
    navigate("/order", { state: { callFromCart: true } });
  };

  return (
    <div className="m-4 p-2 d-flex flex-column w-50">
      <Button
        className="btn btn-dark w-100 checkout-button m-2 fs-5"
        onClick={placeOrder}
      >
        Checkout
        <FaLongArrowAltRight className="m-2" size={24} />
      </Button>
      <p className="fs-5 m-2">
        <b>ORDER SUMMARY</b>
      </p>
      <div className="m-2 mt-4 d-flex flex-row justify-content-between">
        <p>Items Amount:</p>{" "}
        <p>
          <b>₹ {totalPrice}</b>
        </p>
      </div>
      <div className="m-2 d-flex flex-row justify-content-between">
        <p>Delivery :</p>{" "}
        <p>
          <b>Free</b>
        </p>
      </div>
      <hr></hr>
      <div>
        <p className="m-2 d-flex flex-row justify-content-between">
          <b>Total Amount:</b> <b>₹ {totalPrice}</b>
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
