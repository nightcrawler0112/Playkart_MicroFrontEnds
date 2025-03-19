import React, { useState, useEffect } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

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
      <div className="card-body ">
        {product?.stock === 0 ? (
          <div className="border border-dark text-center rounded bg-danger text-white  pb-1">
            Out of Stock
          </div>
        ) : (
          <div className="card-text text-danger text-center fs-5">
            <b>₹ {product?.price}</b>
          </div>
        )}

        <h5 className="card-title text-center">{product?.name}</h5>
        <h6 className="card-text text-muted text-center">
          {product?.category}
        </h6>
        {product?.reviewCount ? (
          <div className="d-flex card-text text-muted justify-content-center">
            <div className="d-flex align-items-center ">
              {renderStars(product?.averageRating)}
              <span className="ms-2">({product?.reviewCount} reviews)</span>
            </div>
          </div>
        ) : (
          <div className="d-flex card-text text-muted justify-content-center">
            <div className="d-flex align-items-center ">
              {renderStars(0)}
              <span className="ms-2">(0 reviews)</span>
            </div>
          </div>
        )}
        <div className="d-flex justify-content-center mt-2">
          <div className="btn btn-primary bg-dark" onClick={handleProductClick}>
            View product
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
