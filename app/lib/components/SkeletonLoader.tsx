import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div
      className="skeleton-loader animate-pulse"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "60px",
          backgroundColor: "#444",
          borderRadius: "4px",
          marginRight: "10px",
        }}
      ></div>
      <div
        style={{
          width: "70%",
          height: "16px",
          backgroundColor: "#444",
          borderRadius: "4px",
        }}
      ></div>
    </div>
  );
};

export default SkeletonLoader;