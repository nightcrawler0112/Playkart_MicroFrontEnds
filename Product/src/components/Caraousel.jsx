import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Caraousel.css";
import { Button, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CaraouselProducts from "./CaraouselProducts.jsx";

const Caraousel = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("SportsWears");
  const navigate = useNavigate();
  const handleSeeAllClick = () => {
    navigate("/product");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/products/category/${category}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div>
      <p className="m-2 p-2 pt-4 fs-2 pt-4">
        <h2 className="carousel-header">WHAT'S HOT?</h2>
      </p>
      <div className="d-flex flex-row p-2 gap-3 position-relative align-items-center text-center ">
        <Button
          className="m-2 fw-bold fs-5 col-2"
          variant="light"
          onClick={() => setCategory("SportsWears")}
        >
          Clothes
        </Button>
        <Button
          className="m-2 fw-bold fs-5 col-2 "
          variant="light"
          onClick={() => setCategory("SportsEquipments")}
        >
          Equipments
        </Button>
        <div className="col-5"></div>
        <div className=" pt-2 mt-2 fs-5 col-2 fw-bold">
          <u role="button" onClick={handleSeeAllClick}>
            <p>View All</p>
          </u>
        </div>
      </div>

      <CaraouselProducts products={products} />
    </div>
  );
};

export default Caraousel;
