import React from "react";

const SearchSkeletonLoader: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-2 animate-pulse">
      <div className="w-[50px] h-[60px] bg-gray-700 rounded-md flex-shrink-0" />

      <div className="flex flex-col flex-1 gap-2">
        <div className="h-4 bg-gray-600 rounded w-3/4" />
        <div className="h-3 bg-gray-600 rounded w-1/2" />
      </div>
    </div>
  );
};

export default SearchSkeletonLoader;