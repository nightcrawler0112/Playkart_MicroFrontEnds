import React, { useState, useEffect } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [ratingData, setRatingData] = useState({
    averageRating: null,
    reviewCount: 0,
  });

  // useEffect(() => {
  //   const fetchRating = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8081/reviews/product/${product.id}/rating`
  //       );
  //       setRatingData({
  //         averageRating: response.data.averageRating,
  //         reviewCount: response.data.reviewCount,
  //       });
  //     } catch (error) {
  //       console.error(error.message || "Error fetching product rating:", error);
  //     }
  //   };

  //   fetchRating();
  // }, [product.id]);

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
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

  return (
    <div className="card bg-light">
      <img
        src={product?.imageURL}
        className="card-img-top bg-light"
        alt={product?.name}
      />
      <div className="card-body">
        <h5 className="card-text text-danger">₹ {product?.price}</h5>
        <h5 className="card-title">{product?.name}</h5>
        <h6 className="card-text text-muted">{product?.category}</h6>
        {product?.reviewCount !== 0 ? (
          <div className="card-text text-muted">
            <div className="d-flex align-items-center m-2">
              {renderStars(product?.averageRating)}
              <span className="ms-2">({product?.reviewCount} reviews)</span>
            </div>
          </div>
        ) : (
          <div className="card-text text-muted">
            <div className="d-flex align-items-center m-2">
              {renderStars(0)}
              <span className="ms-2">({0} reviews)</span>
            </div>
          </div>
        )}
        <div className="d-flex justify-content-center">
          <div className="btn btn-primary bg-dark" onClick={handleProductClick}>
            View product
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
