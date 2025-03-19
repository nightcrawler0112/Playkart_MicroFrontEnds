import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { Container, Row, Col } from "react-bootstrap";
import { IoFilterCircle } from "react-icons/io5";
import FilterSort from "../components/FilterSort";

const Catalog = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [heading, setHeading] = useState("All Products");
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const gender = queryParams.get("gender");
    const category = queryParams.get("category");
    const searchTerm = queryParams.get("search");

    const fetchFilteredProducts = async () => {
      try {
        let response;
        if (gender) {
          setHeading(`Products for ${gender}`);
          response = await axios.get(
            `http://localhost:8081/products/gender/${gender}`
          );
        } else if (category) {
          setHeading(`Products in ${category}`);
          response = await axios.get(
            `http://localhost:8081/products/category/${category}`
          );
        } else {
          let requestBody = {};

          if (searchTerm) {
            requestBody.searchTerm = searchTerm;
            setHeading(`Search results for "${searchTerm}"`);
          }
          response = await axios.post(
            "http://localhost:8081/products/filter",
            requestBody,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        if (response) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchFilteredProducts();
  }, [location.search]);

  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const handleApplyFilters = (filters) => {
    const fetchFilteredProducts = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8081/products/filter",
          filters,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchFilteredProducts();
  };

  return (
    <Container>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <h1>{heading}</h1>
        <div
          className="m-4 p-2 border border-dark rounded"
          onClick={handleShowOffcanvas}
          role="button"
        >
          <b>FILTER & SORT</b>
          <IoFilterCircle size={28} className="ms-2" />
        </div>
      </div>
      <Row>
        {products.map((product) => (
          <Col key={product.id} lg={3} className="mb-4">
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      <FilterSort
        show={showOffcanvas}
        handleClose={handleCloseOffcanvas}
        onApply={handleApplyFilters}
      />
    </Container>
  );
};

export default Catalog;
