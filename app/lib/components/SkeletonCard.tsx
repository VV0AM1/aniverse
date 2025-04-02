import React from "react";

const SkeletonCard: React.FC = () => {
  return (
    <div className="card-container h-500 px-12 py-6 flex justify-center flex-col animate-pulse">
      <div className="w-[195px] h-[330px] bg-gray-700 rounded-[10px] mb-5"></div>
    </div>
  );
};

export default SkeletonCard;