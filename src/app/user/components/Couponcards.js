'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Importing the new icon

// CouponCard Component
const CouponCard = ({ company, topDiscount }) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(`/pages/onecompany/${company.id}`);
  };

  return (
    <div className="border rounded-lg shadow-lg p-4 sm:p-6 flex flex-col text-left bg-white">
      <div className="mb-4 flex justify-center items-center">
        <img
          src={`http://coupnri.m3xtraders.com/uploads/${company.comp_logo}`}
          alt={company.com_title}
          className="w-full h-32 sm:h-48 object-contain rounded"
        />
      </div>
      <div className="text-xl sm:text-2xl font-extrabold text-black mb-2">
        {topDiscount !== 'Not Available' ? `${topDiscount}% OFF` : 'Not Available'}
      </div>
      <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4">
        {company.com_title}
      </div>
      <div className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-4">
        {company.comp_description}
      </div>
      <div className="flex items-center text-sm text-gray-700 font-semibold mb-2 sm:mb-4">
        <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
        <span>Verified Coupon</span>
      </div>
      <button
        onClick={handleButtonClick}
        className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-blue-700 text-sm font-bold w-full sm:w-auto"
      >
        Coupon Code
      </button>
    </div>
  );
};

export default CouponCard;
