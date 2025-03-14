import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Review = ({ review }) => {
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
    <div className="bg-light m-2">
      <div className="d-flex justify-content-between">
        <div className="d-flex gap-2 align-items-center p-2">
          <FaRegCircleUser size={30} />
          <b>{review?.userName}</b>
        </div>
        <p>{renderStars(review?.rating)}</p>
      </div>
      <p className="fs-6 p-2 text-secondary">
        <b>{review?.comment}</b>
      </p>
    </div>
  );
};

export default Review;
