import React, { useRef, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo.png";
import "./header.css";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const { isLoggedIn, logout } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search");
    if (searchTerm) {
      searchInputRef.current.value = searchTerm;
    }
  }, [location.search]);

  const handleCategoryClick = (category) => {
    navigate(`/product?category=${category}`);
  };
  const handleGenderClick = (gender) => {
    navigate(`/product?gender=${gender}`);
  };
  const handleLogoClick = () => {
    navigate("/");
  };
  const handleSearchButton = () => {
    const searchQuery = searchInputRef.current.value;
    navigate(`/product?search=${searchQuery}`);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logout successful!");
    navigate("/");
  };
  const handleUserProfile = () => {
    if (isLoggedIn) navigate("/profile");
  };

  const getUserCart = () => {
    if (isLoggedIn) navigate("/cart");
    else navigate("/login");
  };

  return (
    <Container fluid className="p-0 m-0 py-0 h-25">
      <Row className="align-items-center p-1 m-1">
        <Col>
          <img
            src={logo}
            alt="Playkart"
            role="button"
            className="img-fluid align-items-center"
            onClick={handleLogoClick}
          />
        </Col>
        <Col></Col>

        <Col className="text-center">
          <h6 role="button" onClick={() => handleGenderClick("Men")}>
            MEN
          </h6>
        </Col>
        <Col className="text-center">
          <h6 role="button" onClick={() => handleGenderClick("Women")}>
            WOMEN
          </h6>
        </Col>
        <Col className="text-center">
          <h6 role="button" onClick={() => handleGenderClick("Kids")}>
            KIDS
          </h6>
        </Col>
        <Col className="text-center">
          <h6 role="button" onClick={() => handleCategoryClick("SportsWears")}>
            WEARS
          </h6>
        </Col>
        <Col className="text-center">
          <h6
            role="button"
            onClick={() => handleCategoryClick("SportsEquipments")}
          >
            EQUIPMENTS
          </h6>
        </Col>

        <Col className="col-3">
          <form className="d-flex">
            <input
              ref={searchInputRef}
              className="form-control me-2 mb-2 search-input"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <Button
              onClick={handleSearchButton}
              className="d-flex btn-custom bg-dark align-items-center mb-2"
            >
              <FaMagnifyingGlass />
            </Button>
          </form>
          <Col></Col>
        </Col>
        <Col>
          {isLoggedIn && (
            <FaUserCircle
              role="button"
              className="mb-2"
              size={32}
              onClick={handleUserProfile}
            />
          )}
        </Col>
        <Col>
          {isLoggedIn && (
            <FaShoppingCart
              role="button"
              size={32}
              className="icons mb-2"
              onClick={getUserCart}
            />
          )}
        </Col>
        <Col>
          {isLoggedIn ? (
            <Button className="bg-dark mb-2" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button className="bg-dark mb-2" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Navbar;
