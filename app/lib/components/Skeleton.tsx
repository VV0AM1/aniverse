import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="skeleton-card bg-gray-700 animate-pulse rounded-md w-full"></div>
  );
};

export default SkeletonLoader;