import React from 'react';

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        className="w-32 h-32"
        src="img/loading.mp4" 
      />
    </div>
  );
};

export default FullPageLoader;