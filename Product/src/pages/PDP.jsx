import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { FaCartPlus, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { GiShoppingBag } from "react-icons/gi";
import { toast, ToastContainer } from "react-toastify";
import "./PDP.css";
import Review from "../components/Review";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [ratingData, setRatingData] = useState({
    averageRating: null,
    reviewCount: 0,
    reviews: [],
  });
  const [similarProducts, setSimilarProducts] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasOrdered, setHasOrdered] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/products/${location.pathname.split("/")[2]}`
        );
        console.log("Fetched product:", response.data);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchRatingAndReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/reviews/product/${
            location.pathname.split("/")[2]
          }`
        );
        const reviews = response.data;
        const reviewCount = reviews.length;
        const averageRating =
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;

        setRatingData({
          averageRating: isNaN(averageRating) ? 0 : averageRating,
          reviewCount,
          reviews,
        });

        console.log("Fetched product rating and reviews:", response.data);
      } catch (error) {
        console.error("Error fetching product rating and reviews:", error);
      }
    };

    const checkUserHasOrdered = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:8082/order/product/${
            location.pathname.split("/")[2]
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHasOrdered(response.data);
      } catch (error) {
        console.error("Error checking if user has ordered the product:", error);
      }
    };

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8080/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProduct();
    fetchRatingAndReviews();
    checkUserHasOrdered();
    fetchUserProfile();
  }, [location.pathname]);

  useEffect(() => {
    const fetchSimilarProducts = async (gender, category) => {
      try {
        const response = await axios.post(
          `http://localhost:8081/products/filter`,
          {
            gender: gender,
            category: category,
          }
        );
        const filteredProducts = response.data
          .filter((similarProduct) => similarProduct.id !== product.id)
          .sort((a, b) => {
            if (b.averageRating === a.averageRating) {
              return b.reviewCount - a.reviewCount;
            }
            return b.averageRating - a.averageRating;
          });

        setSimilarProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    if (product.gender && product.category) {
      fetchSimilarProducts(product.gender, product.category);
    }
  }, [product]);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    } else {
      toast.error("Quantity must be at least 1", {
        autoClose: 3000,
      });
    }
  };

  const addItemtoCart = async (productId, quantity) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:8082/cart/",
        {
          productId,
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Added to cart:", response.data);
      toast.success("Item added to cart successfully", {
        autoClose: 3000,
      });
    } catch (error) {
      if (error.response.status === 401) {
        toast.error("Login first to add to cart", {
          autoClose: 3000,
        });
      } else {
        toast.error("Error adding to cart", {
          autoClose: 3000,
        });
      }
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = () => {
    navigate(`/order?productId=${product.id}&quantity=${quantity}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} color="black" />);
    }

    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" color="black" />);
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={i} color="black" />);
    }

    return stars;
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const newReview = {
      productId: product.id,
      userName: user?.name,
      rating,
      comment,
    };

    try {
      await axios.post("http://localhost:8081/reviews", newReview, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRatingData((prevState) => ({
        ...prevState,
        reviews: [...prevState.reviews, newReview],
        reviewCount: prevState.reviewCount + 1,
        averageRating:
          (prevState.averageRating * prevState.reviewCount + newReview.rating) /
          (prevState.reviewCount + 1),
      }));

      setRating(0);
      setComment("");
      toast.success("Review submitted successfully", {
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Error submitting review", {
        autoClose: 3000,
      });
      console.error("Error submitting review:", error);
    }
  };

  const userHasReview = ratingData.reviews.some(
    (review) => review.userName === user?.name
  );

  return (
    <div>
      <ToastContainer />
      <div className="d-flex flex-row">
        <img
          className="product-image m-2 p-2"
          src={product?.imageURL}
          alt={product?.name}
        />
        <div>
          <div className="d-flex flex-row gap-3  m-2 w-100">
            <h5 className="text-muted m-2">{product?.gender} </h5>
            <h5 className="text-muted m-2">{product?.category}</h5>
            {ratingData.averageRating !== null && (
              <div className="d-flex align-items-center m-2">
                {renderStars(ratingData.averageRating)}
                <span className="ms-2">({ratingData.reviewCount} reviews)</span>
              </div>
            )}
          </div>
          <h2 className="m-2 p-2">
            <b>{product?.name}</b>
          </h2>
          <h5 className="m-2 p-2">Brand: {product?.brand}</h5>
          <div className="m-2 pt-3 d-flex flex-row">
            <h5 className="text-muted p-2 ">MRP : </h5>
            <h5 className="p-2">
              <b className="text-danger"> ₹ {product?.price} </b>
            </h5>
            <h5 className="text-muted p-2"> [Inclusive of all taxes]</h5>
          </div>
          <p className="p-2 m-2">
            <b>{product?.description}</b>
          </p>
          <div className="m-2 p-2 d-flex flex-row gap-2 align-items-center">
            <h5>Quantity : </h5>
            <Form.Control
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="w-25 "
            />
          </div>
          <div className="p-2">
            <Button
              variant="secondary"
              className="m-2 p-2"
              onClick={() => addItemtoCart(product.id, quantity)}
            >
              Add to cart
              <FaCartPlus style={{ marginLeft: "8px" }} />
            </Button>
            <Button
              variant="secondary"
              className="m-2 p-2"
              onClick={handleBuyNow}
            >
              Buy Now
              <GiShoppingBag style={{ marginLeft: "8px" }} />
            </Button>
          </div>
          <div className="p-2 m-2 fs-4">
            <b>{ratingData.reviews.length > 0 ? "Reviews" : ""}</b>
            <div>
              {ratingData.reviews.map((review, index) => (
                <div key={index} className="review">
                  <Review review={review} />
                </div>
              ))}
            </div>
            {hasOrdered && !userHasReview && (
              <div className="mt-4 p-2">
                <h5>Add a Review</h5>
                <Form onSubmit={handleSubmitReview}>
                  <Form.Group controlId="rating" className="mt-3">
                    <Form.Label className="fs-5">
                      <b>Rating</b>
                    </Form.Label>
                    <div className="d-flex">
                      {[...Array(5)].map((star, index) => (
                        <FaStar
                          key={index}
                          color={index < rating ? "black" : "gray"}
                          onClick={() => handleStarClick(index)}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group controlId="comment" className="mt-3">
                    <Form.Label className="fs-5">
                      <b>Comment</b>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="dark" type="submit" className="mt-3">
                    Submit Review
                  </Button>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
      {similarProducts.length > 0 && (
        <div className="m-2 p-2">
          <h3 className="m-2 p-4">Similar products For You :</h3>
          <div className="d-flex flex-wrap gap-2 m-2 p-4">
            {similarProducts.map((similarProduct) => (
              <ProductCard key={similarProduct.id} product={similarProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
