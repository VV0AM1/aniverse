import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="skeleton-card animate-pulse bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800"></div>
  );
};

export default SkeletonLoader;