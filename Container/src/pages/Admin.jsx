import React, { useState, useEffect } from "react";
import { Tab, Tabs, Table, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Admin.css";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import UnauthorizedAccess from "../components/UnauthorizedAccess";
import { jwtDecode } from "jwt-decode";
const Admin = () => {
  const [key, setKey] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "SportsWears",
    gender: "Men",
    brand: "Puma",
    stock: 1,
    price: 1,
    imageURL: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token !== null) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.isAdmin);
      if (decodedToken.isAdmin) {
        fetchUsers();
        fetchProducts();
        fetchOrders();
      }
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/products/filter",
        {}
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8082/order/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  const handleMakeAdmin = async (userEmail) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8080/user/makeAdmin`,
        {
          userEmail: userEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("User promoted to admin successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error making user admin:", error);
      toast.error("Error making user admin");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8081/products/", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product added successfully");
      setNewProduct({
        name: "",
        description: "",
        category: "SportsWears",
        gender: "Men",
        brand: "Puma",
        stock: 1,
        price: 1,
        imageURL: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(
        error.response.data.name ||
          error.response.data.description ||
          error.response.data.stock ||
          error.response.data.price ||
          "Error adding product"
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8081/products/${editProduct.id}`,
        editProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product updated successfully");
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error.response.data.price ||
          error.response.data.stock ||
          error.response.data.name ||
          error.response.data.description ||
          "Error updating product"
      );
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  if (!isAdmin) {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="container mt-5">
      <h1 className="m-1 p-2 mb-4">Admin Functionalities</h1>
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 custom-tabs"
      >
        <Tab eventKey="users" title="Get All Users">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.admin ? "Admin" : "Customer"}</td>{" "}
                  <td className="make-admin-btn">
                    <Button
                      variant="dark"
                      onClick={() => handleMakeAdmin(user.email)}
                      className="m-2"
                      disabled={user.admin}
                    >
                      Make Admin
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="addProduct" title="Add Product">
          <Form onSubmit={handleAddProduct}>
            <Form.Group controlId="formProductName">
              <Form.Label>
                <b>Product Name *</b>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formProductDescription">
              <Form.Label>
                <b>Product Description *</b>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formProductCategory">
              <Form.Label>
                <b>Category *</b>
              </Form.Label>
              <Form.Select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                <option value="SportsWears">SportsWears</option>
                <option value="SportsEquipments">SportsEquipments</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formProductGender">
              <Form.Label>
                <b>Gender *</b>
              </Form.Label>
              <Form.Select
                value={newProduct.gender}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, gender: e.target.value })
                }
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formProductBrand">
              <Form.Label>
                <b>Brand *</b>
              </Form.Label>
              <Form.Select
                value={newProduct.brand}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, brand: e.target.value })
                }
              >
                <option value="Puma">Puma</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Reebok">Reebok</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formProductStock">
              <Form.Label>
                <b>Stock *</b>
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formProductPrice">
              <Form.Label>
                <b>Price *</b>
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formProductImageUrl">
              <Form.Label>
                <b>Product ImageURL</b>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Provide ImageURL for product"
                value={newProduct.imageURL}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imageURL: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="dark" type="submit" className="mt-3 mb-3 w-25">
              Add Product
            </Button>
          </Form>
        </Tab>
        <Tab eventKey="listProducts" title="List of Products">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Gender</th>
                <th>Brand</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.category}</td>
                  <td>{product.gender}</td>
                  <td>{product.brand}</td>
                  <td>{product.stock}</td>
                  <td>₹{product.price}</td>
                  <td>
                    <MdEdit
                      role="button"
                      size={20}
                      onClick={() => handleEditProduct(product)}
                    />

                    <MdDelete
                      role="button"
                      size={20}
                      onClick={() => handleDeleteProduct(product.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="viewOrders" title="View All Orders">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User Name</th>
                <th>Total Price</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.orderItems[0]?.userName || "N/A"}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>
                    {new Date(
                      order.orderItems[0]?.createdAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {editProduct && (
        <Modal show={true} onHide={() => setEditProduct(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateProduct}>
              <Form.Group controlId="formEditProductName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editProduct.name}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEditProductDescription">
                <Form.Label>Product Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={editProduct.description}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEditProductCategory">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={editProduct.category}
                  onChange={handleEditInputChange}
                >
                  <option value="SportsWears">SportsWears</option>
                  <option value="SportsEquipments">SportsEquipments</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formEditProductGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={editProduct.gender}
                  onChange={handleEditInputChange}
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formEditProductBrand">
                <Form.Label>Brand</Form.Label>
                <Form.Select
                  name="brand"
                  value={editProduct.brand}
                  onChange={handleEditInputChange}
                >
                  <option value="Puma">Puma</option>
                  <option value="Nike">Nike</option>
                  <option value="Adidas">Adidas</option>
                  <option value="Reebok">Reebok</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formEditProductStock">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={editProduct.stock}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEditProductPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={editProduct.price}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEditProductImageUrl">
                <Form.Label>Product ImageURL</Form.Label>
                <Form.Control
                  type="text"
                  name="imageURL"
                  value={editProduct.imageURL}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              <Button variant="dark" type="submit" className="mt-3 mb-3 w-50">
                Update Product
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default Admin;
