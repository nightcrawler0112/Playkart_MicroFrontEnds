import React, { Suspense, lazy } from "react";
import { Row } from "react-bootstrap";
import About from "../components/About";
import "./Homepage.css";
import ErrorBoundary from "../components/ErrorBoundary";

// Lazy load the Caraousel component
const Caraousel = lazy(() => import("mf_product/Caraousel"));

const Homepage = () => {
  return (
    <>
      <div>
        <Row>
          <img
            src={
              "https://img.freepik.com/free-vector/sport-equipment-concept_1284-13034.jpg?t=st=1741756780~exp=1741760380~hmac=c3c28fe06159f82859f7d72595c63bfb424af1f1d1eaab1f50df7eea06c952ae&w=1060"
            }
            alt="background"
            className="bg-image"
          />
        </Row>
      </div>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Caraousel />
        </Suspense>
      </ErrorBoundary>
      <About />
    </>
  );
};

export default Homepage;
