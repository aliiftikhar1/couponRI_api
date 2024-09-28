import React from 'react';

const CompanyCard = ({ company, topDiscount }) => {
  return (

    <div className="flex items-center justify-center p-4 h-full w-full">
      
      <div className="flex flex-col items-center">
      <a href={`/pages/onecompany/${company.id}`}>
        <img
          src={`https://m3xtrader.com/coupon/uploads/${company.comp_logo}`}
          alt={company.com_title}
          className="w-28 h-28 object-contain p-1 bg-white hover:shadow-md rounded-full"
        />
        </a>
        <a href={`/pages/onecompany/${company.id}`}>
        <span className="text-sm font-semibold hover:text-blue-700">{company.com_title}</span>
        </a>
      </div>
    </div>
  );
};

export default CompanyCard;
