import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form } from "react-bootstrap";
import "./CartItem.css";

const CartItem = ({ item, onRemove, onUpdate, showButtons = true }) => {
  const [quantity, setQuantity] = useState(item?.quantity);
  const [price, setPrice] = useState(item?.price);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const updateCartItem = async (newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8082/cart/${item?.cartItemId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Updated item quantity in cart:", item?.cartItemId);
      toast.success("Item quantity updated successfully", {
        autoClose: 3000,
      });
      onUpdate();
    } catch (error) {
      console.log("Error updating item quantity in cart:", error);
      toast.error(
        error.response.data.message || "Error updating item quantity in cart",
        {
          autoClose: 3000,
        }
      );
    }
  };

  const debouncedUpdateCartItem = useCallback(
    debounce(updateCartItem, 5000),
    []
  );

  useEffect(() => {
    if (quantity !== item?.quantity && quantity >= 0) {
      debouncedUpdateCartItem(quantity);
    }
  }, [quantity, item?.cartItemId, item?.quantity, debouncedUpdateCartItem]);

  const removeCartItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8082/cart/${cartItemId}`,
        {
          quantity: 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Removed item from cart:", cartItemId);
      onRemove(cartItemId);
      toast.success("Item removed from cart successfully", {
        autoClose: 3000,
      });
      onUpdate();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error(
        error.response.data.message || "Error removing item from cart",
        {
          autoClose: 3000,
        }
      );
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity =
      e.target.value === "" ? "" : parseInt(e.target.value, 10);
    if (newQuantity === "" || newQuantity >= 0) {
      setPrice((item?.price / item?.quantity) * (newQuantity || 0));
      setQuantity(newQuantity);
    } else {
      toast.error("Quantity must be at least 0", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="card p-2 m-2 w-100 h-25">
      <div className="d-flex flex-row gap-4 align-items-center bg-light">
        <div className="w-25 ">
          <img
            src={item?.imageUrl}
            alt={item.productName}
            className="cart-item-image h-50"
          />
        </div>
        <div className="m-2 col-6">
          <h3>{item?.productName || item?.name}</h3>
          <h4 className="text-danger"> ₹{price}</h4>
          <div className="d-flex flex-row gap-4">
            {showButtons ? (
              <div className="d-flex flex-row gap-4">
                <p className="fs-6 m-1">
                  <b>Quantity : </b>
                </p>
                <Form.Control
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-25"
                />
              </div>
            ) : (
              <p className="fs-6 m-1">
                <b>Quantity : {quantity} </b>
              </p>
            )}
          </div>
          {showButtons && (
            <div className="d-flex flex-row gap-4">
              <button
                className="btn btn-danger"
                onClick={() => removeCartItem(item?.cartItemId)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
