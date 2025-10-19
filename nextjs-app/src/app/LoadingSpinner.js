// LoadingSpinner.js
"use client"
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center space-x-2 p-4 m-4">
      <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <span className="text-blue-500 font-semibold">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
