import React from 'react';
import { useRouter } from 'next/navigation';

const CompanyCard = ({ company }) => {
  const router = useRouter();

  const handleViewOffers = () => {
    router.push(`/user/pages/2nd_page/${company.id}`);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 sm:p-6 bg-white">
      <img 
        src={`https://couponri.com/uploads/${company.comp_logo}`} 
        alt={company.com_title} 
        className="w-full h-24 sm:h-32 object-cover rounded-lg mb-4" 
      />
      <h2 className="text-lg sm:text-xl font-semibold text-black mb-2">
        {company.com_title}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-4">
        {company.comp_description}
      </p>
      <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-4">
        {company.com_details}
      </p>
      <div className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-4">
        <span className="block">Phone: {company.comp_phone}</span>
        <span className="block">Email: {company.comp_email}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-orange-400 font-medium text-sm sm:text-base">Rating: {company.comp_rating}</span>
        <a 
          href={`${company.comp_website}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline text-sm sm:text-base"
        >
          Visit Website
        </a>
      </div>
      <button
        onClick={handleViewOffers}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full text-sm sm:text-base"
      >
        View Offers
      </button>
    </div>
  );
};

export default CompanyCard;
