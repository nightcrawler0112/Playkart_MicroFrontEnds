import React, { Component } from "react";
import serverdownimg from "../images/sad-image.jpg";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center m-2 p-2">
          <p className="fs-2">
            <b>Its not you , it's us !!</b>😭😭😭{" "}
          </p>
          <img src={serverdownimg} className="w-50 h-50" alt="Server Down" />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
