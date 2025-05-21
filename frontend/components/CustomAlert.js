import React from 'react';

const CustomAlert = ({ message, status }) => {
  console.log('CustomAlert rendering:', { message, status });

  if (!message) {
    console.log('CustomAlert not rendering: no message');
    return null;
  }

  const getIcon = () => {
    if (status === true || status === 'success') {
      return (
        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (status === false || status === 'error') {
      return (
        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white p-4 rounded-lg shadow-xl flex items-center z-[1000]">
      {getIcon()}
      <span className="text-gray-800">{message}</span>
    </div>
  );
};

export default CustomAlert;