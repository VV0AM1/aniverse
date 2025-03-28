const TopSkeletonLoader = () => {
    return (
      <div className="top-card-container flex gap-3 p-2 rounded-lg animate-pulse">

        <div className="w-12 h-18 bg-gray-700 rounded-md"></div>
  
        <div className="flex flex-col flex-1">
          <div className="w-3/4 h-3 bg-gray-700 rounded mb-2"></div>
          <div className="w-2/4 h-3 bg-gray-700 rounded mb-2"></div>
  
          <div className="flex gap-2 mt-1">
            <div className="w-12 h-4 bg-gray-700 rounded"></div>
            <div className="w-10 h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TopSkeletonLoader;