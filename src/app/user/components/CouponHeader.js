'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

const CouponHeader = ({ company }) => {
  if (!company) {
    return <div>Loading...</div>;
  }

  // Get the current month and year
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonth = months[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-[#07069F] mb-20 p-2 text-white flex items-center justify-center h-36 w-full relative">
      <div className="absolute md:left-[15rem] left-1/2 transform -translate-x-1/2 md:translate-x-0 top-28 md:top-16 h-24 w-24 md:h-36 md:w-36 flex justify-center items-center bg-white rounded-full">
        
        <a href={`https://${company.comp_affiliateLink}`} target="_blank" rel="noopener noreferrer">
          <img
            src={`https://m3xtrader.com/coupon/uploads/${company.comp_logo}`}
            alt={company.com_title}
            className="h-24 w-24 md:h-36 md:w-36 object-contain bg-white rounded-full border-4 border-white"
          />
        </a>
        
      </div>

      <div className="md:mt-0 ml-6 text-center md:text-left">
        <h1 className="text-xl md:text-3xl font-bold">
          {company.comp_webtitle ? company.comp_webtitle : 'Web Title'}
        </h1>
        <p className="text-xs md:text-lg flex flex-row items-start justify-start md:justify-start">
          {company.com_title} Coupon Codes for {currentMonth} {currentYear} Verified & Tested
          <CheckCircleIcon className="h-5 md:h-6 w-5 md:w-6 pt-1 ml-1 md:ml-2" />
        </p>
      </div>
    </div>
  );
};

export default CouponHeader;
