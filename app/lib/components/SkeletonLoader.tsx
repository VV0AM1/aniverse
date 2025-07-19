import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse bg-[#1c1c1e] rounded-lg w-[140px] h-[230px] sm:w-[180px] sm:h-[300px] mx-auto">
      <div className="w-full h-[80%] bg-gray-700 rounded-t-lg"></div>
      <div className="p-2 space-y-2">
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;