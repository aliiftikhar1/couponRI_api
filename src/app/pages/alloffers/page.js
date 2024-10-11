'use client';

import React, { useEffect, useState } from 'react';
import CustomerRootLayout from '../../../app/user/layout';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [copyMessage, setCopyMessage] = useState(''); // New state for copy message


  useEffect(() => {
    const fetchOffersAndCompanies = async () => {
      try {
        const offersResponse = await fetch('/api/offers');
        if (!offersResponse.ok) {
          throw new Error('Failed to fetch offers data');
        }
        const offersData = await offersResponse.json();

        const companiesResponse = await fetch('/api/company');
        if (!companiesResponse.ok) {
          throw new Error('Failed to fetch companies data');
        }
        const companiesData = await companiesResponse.json();

        const offersWithCompanyDetails = offersData.map((offer) => {
          const company = companiesData.find((comp) => comp.id === offer.comp_id);
          return {
            ...offer,
            company,
          };
        });

        setOffers(offersWithCompanyDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOffersAndCompanies();
  }, []);

  const handleShowPopup = (offer) => {
    setSelectedOffer(offer);
    setShowPopup(true);
    // Open the affiliate link in a new tab when "Show Code" is clicked

      window.open(offer. offer_affiliateLink, '_blank');
    
  };

  const handleGetOffer = (offer) => {
    // Directly open the affiliate link in a new tab without showing the popup

      window.open(offer. offer_affiliateLink, '_blank');

  };

  const handleCopyCode = () => {
    if (selectedOffer.offer_code) {
      navigator.clipboard.writeText(selectedOffer.offer_code);
      setCopyMessage('Coupon code copied!'); // Set copy message
      setTimeout(() => setCopyMessage(''), 2000); // Clear message after 2 seconds
    }
  };
  const handleClosePopup = () => {
    setSelectedOffer(null);
    setShowPopup(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">{`Error: ${error}`}</div>;
  }

  if (!offers.length) {
    return <div className="flex items-center justify-center min-h-screen bg-yellow-100 text-yellow-700">No offers available.</div>;
  }

  return (
    <CustomerRootLayout>
      <div className="min-h-screen bg-white p-4 sm:p-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-black mb-6 sm:mb-8">
          Available Offers
        </h1>

        <div className="container mx-auto grid gap-4 sm:gap-8 grid-cols-1 md:grid-cols-2 px-2 sm:px-20">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg p-2 sm:p-4 shadow-lg overflow-hidden border border-gray-300 flex flex-col sm:flex-row transition-transform duration-300 hover:scale-105 h-auto sm:h-52"
            >
              {offer.company && (
                <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                  <img
                    src={`https://m3xtrader.com/coupon/uploads/${offer.company.comp_logo}`}
                    alt={offer.company.com_title}
                    className="w-full h-32 sm:h-full object-contain rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                  />
                </div>
              )}
              <div className="p-2 sm:p-4 text-left w-full sm:w-2/3 flex flex-col justify-center">
  <h3 className="text-lg sm:text-xl font-bold text-black mb-1 sm:mb-2">{offer.offer_title}</h3>
  
  {/* Truncated description */}
  <p className="text-sm sm:text-base text-gray-700 mb-2 line-clamp-2">
    {offer.offer_description}
  </p>

  <div className="flex justify-between items-center">
    <span className="block text-gray-500 text-sm sm:text-base">
      Expiry: {new Date(offer.offer_expiry).toLocaleDateString()}
    </span>

    <div className="flex justify-end">
      {offer.offer_type !== 'Offer' ? (
        <button
          className="relative bg-[#07069F] text-white py-3 px-8 text-sm font-bold rounded-lg cursor-pointer overflow-hidden transition duration-300 ease-in-out hover:bg-[#07069F] group"
          onClick={() => handleShowPopup(offer)}
        >
          Show Code
          <span className="corner top-right-corner absolute top-0 right-0 w-[30px] h-[30px] bg-[#cdcdf8] clip-path-polygon-100_0_0_0_100_100 transition-transform duration-0 transform-origin-top-right group-hover:scale-125 group-hover:right-[3px] group-hover:-translate-x-[0px] group-hover:-translate-y-[0px]"></span>
          <span className="corner bottom-left-corner absolute top-0 right-0 w-[30px] h-[30px] bg-[#5858c3] clip-path-polygon-0_100_100_100_0_0 transition-transform duration-0 transform-origin-bottom-left group-hover:scale-125 group-hover:right-[3px] group-hover:-translate-x-[0px] group-hover:translate-y-[0px]"></span>
        </button>
      ) : (
        <button
          className="relative bg-[#07069F] text-white py-3 px-8 text-sm font-bold rounded-lg cursor-pointer overflow-hidden transition duration-300 ease-in-out hover:bg-[#07069F] group"
          onClick={() => handleGetOffer(offer)}
        >
          Get Offer
        </button>
      )}
    </div>
  </div>
</div>

            </div>
          ))}
        </div>

        {showPopup && selectedOffer && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-6 sm:p-8 flex flex-col justify-center rounded-lg shadow-lg w-full h-[90vh] max-w-3xl relative">
      <button
        onClick={handleClosePopup}
        className="absolute top-2 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
      >
        &times;
      </button>

      {/* Updated Image Styling */}
      <img
        src={`https://m3xtrader.com/coupon/uploads/${selectedOffer.company.comp_logo}`}
        alt={selectedOffer.company.com_title}
        className="h-40 w-40 rounded-full mx-auto mb-4"
      />

      {/* Updated Title */}
      <h3 className="text-xl font-semibold mb-2 text-center">
        {selectedOffer.offer_title}
      </h3>

      {/* Coupon Code Container */}
      <div className='px-16 py-2 border-[1px] mb-4 w-auto mx-auto border-gray-800 h-auto flex justify-center items-center'>
        <p className="text-3xl text-center font-semibold">
          {selectedOffer.offer_code ? selectedOffer.offer_code : 'No coupon code needed'}
        </p>
      </div>

      {/* Copy Code Button */}
      {selectedOffer.offer_code && (
        <button
          onClick={handleCopyCode}
          className="bg-gray-200 text-gray-700 px-4 py-2 mx-auto rounded-full hover:bg-gray-300 w-auto mb-4"
        >
          Copy Code
        </button>
      )}

      {/* Copy Message */}
      {copyMessage && (
        <p className="text-green-600 text-center mb-2">{copyMessage}</p>
      )}

      {/* Redeem Offer Button */}
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-auto mx-auto mb-4"
        onClick={() => window.open(selectedOffer.offer_affiliateLink, '_blank')}
      >
        Use at {selectedOffer.company.com_title}
      </button>

      {/* Coupon Usage Instructions */}
      <p className="text-center text-sm text-gray-600 mb-2">
        Copy the code, then go to {selectedOffer.company.com_title} and paste it during checkout.
      </p>
    </div>
  </div>
)}

      </div>
    </CustomerRootLayout>
  );
};

export default OffersPage;
