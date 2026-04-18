import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner__overlay">
      <div className="lds-dual-ring"></div>
    </div>
  );
};

export default LoadingSpinner;