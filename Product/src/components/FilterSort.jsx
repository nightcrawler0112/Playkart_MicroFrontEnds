import React, { useState, useEffect } from "react";
import { Offcanvas, Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const FilterSort = ({ show, handleClose, onApply }) => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    brand: "",
    gender: "",
    category: "",
    sortBy: "",
    sortDirection: "",
    searchTerm: "", // Add searchTerm to the filters state
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search");
    if (searchTerm) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        searchTerm,
      }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(filters);
    onApply(filters);
    handleClose();
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <b>Filter & Sort</b>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="filterPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Min Price"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
            />
            <Form.Control
              type="number"
              placeholder="Max Price"
              className="mt-2"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="filterBrand">
            <Form.Label>Brand</Form.Label>
            <Form.Select
              name="brand"
              value={filters.brand}
              onChange={handleChange}
            >
              <option value="">Select Brand</option>
              <option value="Nike">Nike</option>
              <option value="Adidas">Adidas</option>
              <option value="Puma">Puma</option>
              <option value="Reebok">Reebok</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="filterGender">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="filterCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="SportsWears">SportsWears</option>
              <option value="SportsEquipments">SportsEquipments</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="filterSort">
            <Form.Label>Sort By</Form.Label>
            <Form.Select
              name="sort"
              value={`${filters.sortBy}-${filters.sortDirection}`}
              onChange={(e) => {
                const [sortBy, sortDirection] = e.target.value.split("-");
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  sortBy,
                  sortDirection,
                }));
              }}
            >
              <option value="">Select Sort Option</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </Form.Select>
          </Form.Group>

          <Button variant="dark" type="submit" className="me-2">
            Apply
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FilterSort;
