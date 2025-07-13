const TopSkeletonLoader = () => {
  return (
    <div className="flex items-start gap-4 py-3 cursor-pointer animate-pulse border-b border-[#2a2a2a] last:border-none">
      <div className="w-20 h-28 bg-gray-700 rounded-md shrink-0" />

      <div className="flex flex-col gap-1 w-full py-1">
        <div className="h-5 w-3/4 bg-gray-700 rounded" />
        <div className="h-4 w-1/2 bg-gray-700 rounded" />
        <div className="flex gap-2 mt-1">
          <div className="w-16 h-5 bg-gray-700 rounded" />
          <div className="w-20 h-5 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export default TopSkeletonLoader;