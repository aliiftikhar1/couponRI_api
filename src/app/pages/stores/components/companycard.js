import React from 'react';

const CompanyCard = ({ company, topDiscount }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 relative flex flex-col justify-between h-full">
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-end items-center mb-2">
          <span className="bg-white text-gray-900 text-xs font-bold rounded-full px-2 py-1 shadow-lg">
            {topDiscount !== 'Not Available' ? `${topDiscount}% OFF` : topDiscount}
          </span>
        </div>
        <div className="flex-grow">
          <img
            src={`http://coupnri.m3xtraders.com/uploads/${company.comp_logo}`}
            alt={company.com_title}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-sm sm:text-base font-semibold text-gray-700">{company.com_title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            {company.comp_description || 'No description available.'}
          </p>
        </div>
        <div className="mt-4">
          <a
            href={`/pages/onecompany/${company.id}`}
            className="bg-[#06089B] text-white w-full h-10 text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
