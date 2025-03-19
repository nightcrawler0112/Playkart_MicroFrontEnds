import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import logo from "../images/logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressBook from "../components/AddressBook.jsx";
import CartItem from "../components/Cartitem.jsx";

const Order = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const callFromCart = state?.callFromCart || false;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get("productId");
    const quantity = queryParams.get("quantity");

    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error(
          error.response.data.message || "Error fetching user details"
        );
      }
    };

    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/user/address/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAddresses(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error(error.response.data.message || "Error fetching addresses");
      }
    };

    if (productId && quantity) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/products/${productId}`
          );
          const product = response.data;
          setCart([{ ...product, quantity: parseInt(quantity) }]);
          setTotalPrice(product.price * parseInt(quantity));
        } catch (error) {
          console.error("Error fetching product:", error);
          toast.error(error.response.data.message || "Error fetching product");
        }
      };
      fetchProduct();
    } else {
      const fetchCart = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:8082/cart/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCart(response.data.cartItems);
          setTotalPrice(response.data.totalPrice);
        } catch (error) {
          console.error("Error fetching cart:", error);
          toast.error(error.response.data.message || "Error fetching cart");
        }
      };
      fetchCart();
    }

    fetchUserDetails();
    fetchAddresses();
  }, [location.search]);

  const handleAddressAdded = (newAddress) => {
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
  };
  const handleAddressChange = (e) => {
    const addressIndex = e.target.value;
    setSelectedAddress(addresses[addressIndex]);
  };

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const authHeader = `Bearer ${token}`;
      const addressRequestDTO = {
        addressId: selectedAddress.id,
      };

      const response = await axios.post(
        "http://localhost:8082/order/",
        addressRequestDTO,
        {
          headers: { Authorization: authHeader },
        }
      );

      toast.success("Order placed successfully");
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response.data.message || "Error placing order");
    }
  };

  const buyNow = async () => {
    try {
      const token = localStorage.getItem("token");
      const authHeader = `Bearer ${token}`;
      const queryParams = new URLSearchParams(location.search);
      const productId = queryParams.get("productId");
      const quantity = queryParams.get("quantity");

      const cartItemDTO = {
        productId: productId,
        quantity: parseInt(quantity),
        addressId: selectedAddress.id,
      };

      const response = await axios.post(
        "http://localhost:8082/order/instant",
        cartItemDTO,
        {
          headers: { Authorization: authHeader },
        }
      );

      toast.success("Order placed successfully");
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response.data.message || "Error placing order");
    }
  };

  const navigateHomepage = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-2">
            <img
              src={logo}
              alt="logo"
              className="img-fluid w-75"
              role="button"
              onClick={navigateHomepage}
            />
          </div>
        </div>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 text-center">
            <h1>CHECKOUT</h1>
            <p className="text-secondary fs-5">
              {cart.length} Items : ₹{totalPrice}
            </p>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-between">
          <div>
            <div className=" m-2 p-2">
              <h3>CONTACT :</h3>
              <p className="m-3 p-2 fs-5">{user.email}</p>
              <p className="m-3 p-2 fs-5">{user.phoneNumber}</p>
              <hr></hr>
            </div>

            <div className="d-flex flex-row justify-content-between">
              <AddressBook onAddressAdded={handleAddressAdded} />
            </div>
            <div className="row">
              <div className="col-12 m-4 p-2">
                <h3>Choose Address :</h3>
                <div className="col-6">
                  <Form.Control as="select" onChange={handleAddressChange}>
                    <option value="">Select Address</option>
                    {addresses.map((address, index) => (
                      <option key={index} value={index}>
                        Address {index + 1}
                      </option>
                    ))}
                  </Form.Control>
                </div>
                {selectedAddress && (
                  <div>
                    <div className="mt-3">
                      <h5>Selected Address:</h5>
                      <h6>
                        {selectedAddress.street}, {selectedAddress.city},{" "}
                        {selectedAddress.state}, {selectedAddress.zipCode}
                      </h6>
                    </div>
                    {callFromCart ? (
                      <Button variant="dark mt-4 w-75" onClick={placeOrder}>
                        Place Order
                      </Button>
                    ) : (
                      <Button variant="dark mt-4 w-75" onClick={buyNow}>
                        Place Order
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="m-2 p-2 d-flex flex-column h-25 w-50">
            <h3>ORDER SUMMARY :</h3>
            <div className=" m-2 d-flex flex-row justify-content-between">
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
              <p className=" d-flex flex-row justify-content-between">
                <h6>Total Amount:</h6> <b>₹ {totalPrice}</b>
              </p>
            </div>
            <div>
              {cart.map((item) => (
                <div key={item.cartItemId}>
                  <CartItem item={item} showButtons={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
