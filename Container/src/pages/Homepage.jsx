import React, { Suspense, lazy } from "react";

import About from "../components/About";
import "./Homepage.css";
import ErrorBoundary from "../components/ErrorBoundary";
import Carousel from "react-bootstrap/Carousel";
import caraouselimg1 from "../images/caraousel-img.jpg";
import caraouselimg2 from "../images/caraousel-img-2.jpg";
import caraouselimg3 from "../images/caraousel-img-3.jpg";

const Caraousel = lazy(() => import("mf_product/Caraousel"));

const Homepage = () => {
  const navigatePDP = (id) => {
    return () => {
      window.location.href = `/product/${id}`;
    };
  };

  return (
    <div>
      <div className="h-25">
        <Carousel>
          <Carousel.Item
            interval={1500}
            role="button"
            onClick={navigatePDP(848284)}
          >
            <img
              src={caraouselimg3}
              className="d-block w-100 custom-carousel-image"
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item
            interval={1500}
            role="button"
            onClick={navigatePDP(173598)}
          >
            <img
              src={caraouselimg2}
              className="d-block w-100 custom-carousel-image"
              alt="Second slide"
            />
          </Carousel.Item>

          <Carousel.Item
            interval={1500}
            role="button"
            onClick={navigatePDP(742183)}
          >
            <img
              src={caraouselimg1}
              className="d-block w-100 custom-carousel-image"
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="container">
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Caraousel />
          </Suspense>
        </ErrorBoundary>
      </div>
      <About />
    </div>
  );
};

export default Homepage;
