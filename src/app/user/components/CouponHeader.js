'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

const CouponHeader = ({ company }) => {
  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#07069F] mb-20 p-2 text-white flex items-center justify-center h-36 w-full relative">
      <div className="absolute md:left-64 left-1/2 transform -translate-x-1/2 md:translate-x-0 top-28 md:top-16 h-24 w-24 md:h-36 md:w-36 flex justify-center items-center bg-white rounded-full ">
        <img
          src={`https://m3xtrader.com/coupon/uploads/${company.comp_logo}`}
          alt={company.com_title}
          className="h-24 w-24 md:h-36 md:w-36 object-cover rounded-full border-4 border-white"
        />
      </div>

      <div className=" md:mt-0 ml-6 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold">{company.com_title} Coupon Codes</h1>
        <p className="text-sm md:text-lg flex items-center justify-center md:justify-start">
          {company.com_title} Coupon Codes for {new Date().getFullYear()} Verified & Tested
          <CheckCircleIcon className="h-5 md:h-6 w-5 md:w-6 pt-1 ml-1 md:ml-2"/>
        </p>
      </div>
    </div>
  );
};

export default CouponHeader;
