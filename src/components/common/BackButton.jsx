// src/components/common/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ label = "Regresar", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`
        inline-flex items-center gap-2.5
        px-5 py-2.5 
        bg-white 
        border-2 border-[#4CAF50] 
        text-[#2E7D32] 
        font-medium text-sm 
        rounded-lg 
        shadow-sm 
        hover:bg-[#4CAF50] 
        hover:text-white 
        hover:shadow-md 
        transition-all duration-200 
        focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/30
        ${className}
      `}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
      {label}
    </button>
  );
};

export default BackButton;