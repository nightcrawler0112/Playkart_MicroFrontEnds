import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/Layout.jsx";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Lazy load components
const Homepage = lazy(() => import("./pages/Homepage.jsx"));
const Catalog = lazy(() => import("mf_product/Catalog"));
const PDP = lazy(() => import("mf_product/PDP"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Userprofile = lazy(() => import("./pages/Userprofile.jsx"));
const CartPage = lazy(() => import("Cart/CartPage"));
const Order = lazy(() => import("Cart/Order"));
const OrderConfirmation = lazy(() => import("Cart/OrderConfirmation"));
const PlacedOrder = lazy(() => import("Cart/PlacedOrder"));
const Admin = lazy(() => import("./pages/Admin.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Homepage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/product",
    element: (
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Catalog />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <PDP />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Login />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/signup",
    element: (
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Register />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/profile",
    element: (
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Userprofile />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/cart",
    element: (
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <CartPage />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: "/order",
    element: (
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Order />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/order-confirmation",
    element: (
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <OrderConfirmation />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/order/:orderId",
    element: (
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <PlacedOrder />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: "/admin",
    element: (
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Admin />
        </Suspense>
      </Layout>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
