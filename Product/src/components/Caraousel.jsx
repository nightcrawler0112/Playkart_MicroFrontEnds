import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard.jsx";
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
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div>
      <p className="m-2 p-2 fs-2">
        <b>WHAT'S HOT?</b>
      </p>
      <div className="d-flex flex-row p-2 gap-3 position-relative">
        <Button
          className="m-2 fw-bold fs-4"
          variant="light"
          onClick={() => setCategory("SportsWears")}
        >
          Clothes
        </Button>
        <Button
          className="m-2 fw-bold fs-4"
          variant="light"
          onClick={() => setCategory("SportsEquipments")}
        >
          Equipments
        </Button>

        <div className="m-4 fs-4 position-absolute end-0">
          <u role="button" onClick={handleSeeAllClick}>
            See All
          </u>
        </div>
      </div>
      <CaraouselProducts products={products} />
    </div>
  );
};

export default Caraousel;
