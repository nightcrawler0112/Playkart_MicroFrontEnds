import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartItem from "../components/Cartitem";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./UserCart.css";
import OrderSummary from "../components/OrderSummary";
import CaraouselProducts from "mf_product/CaraouselProducts";

const UserCart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8082/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.cartItems);
      setTotalPrice(response.data.totalPrice);
      console.log("Fetched cart:", response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error(error.response.data.message || "Error fetching cart");
    }
  };

  const getStartedButton = () => {
    navigate("/");
  };

  const handleRemoveItem = (cartItemId) => {
    setCart(cart.filter((item) => item.cartItemId !== cartItemId));

    const updatedTotalPrice = cart.reduce((total, item) => {
      if (item.cartItemId !== cartItemId) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
    setTotalPrice(updatedTotalPrice);
  };

  const handleUpdateItem = () => {
    fetchCart();
  };

  return (
    <div className="container">
      <ToastContainer />

      {cart.length === 0 ? (
        <div className="d-flex flex-column gap-4 m-4 p-2 align-items-center">
          <h1>Your cart is empty</h1>
          <p>
            Once you add something to your bag - it will appear here. Ready to
            get started?
          </p>
          <Button className="btn btn-dark w-25" onClick={getStartedButton}>
            Get Started
          </Button>
        </div>
      ) : (
        <div>
          <div className="d-flex flex-row gap-4">
            <div className="w-50 m-2 p-2">
              <div className="p-3">
                <h1>Your Bag :</h1>
                <p className="m-1">
                  TOTAL ({cart.length} items) : <b>₹ {totalPrice}</b>
                </p>
              </div>
              {cart.map((item) => (
                <div key={item.cartItemId}>
                  <CartItem
                    item={item}
                    onRemove={handleRemoveItem}
                    onUpdate={handleUpdateItem}
                  />
                </div>
              ))}
            </div>
            <OrderSummary totalPrice={totalPrice} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;
