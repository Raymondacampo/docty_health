import React from 'react';

const LoadingComponent = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
      <div className="flex space-x-2">
        <div 
          className="w-4 h-4 rounded-full bg-[#3d5a80] animate-bounce"
          style={{ animationDelay: '0s' }}
        ></div>
        <div 
          className="w-4 h-4 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div 
          className="w-4 h-4 rounded-full bg-[#3d5a80] animate-bounce"
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingComponent;