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
                    src={`https://coupnri.m3xtrader.com/uploads/${offer.company.comp_logo}`}
                    alt={offer.company.com_title}
                    className="w-full h-32 sm:h-full object-contain rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                  />
                </div>
              )}
              <div className="p-2 sm:p-4 text-left w-full sm:w-2/3 flex flex-col justify-center">
                <h3 className="text-lg sm:text-xl font-bold text-black mb-1 sm:mb-2">{offer.offer_title}</h3>
                <p className="text-sm sm:text-base text-gray-700 mb-2">{offer.offer_description}</p>
                <div className="mb-2">
                  {offer.offer_link1 && (
                    <a
                      href={offer.offer_link1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline text-sm sm:text-base"
                    >
                      Offer Link 1
                    </a>
                  )}
                  {offer.offer_link2 && (
                    <a
                      href={offer.offer_link2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline text-sm sm:text-base"
                    >
                      Offer Link 2
                    </a>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="block text-gray-500 text-sm sm:text-base">
                    Expiry: {new Date(offer.offer_expiry).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleShowPopup(offer)}
                    className="mt-3 bg-purple-600 text-white w-full sm:w-40 h-10 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    {offer.offer_type === 'Code' ? 'Show Code' : 'Get Offer'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showPopup && selectedOffer && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-xl h-[90vh] relative flex flex-col justify-between">
              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
              <div className="flex items-center justify-center mb-4">
                <img
                  src={`https://coupnri.m3xtrader.com/uploads/${selectedOffer.company.comp_logo}`}
                  alt={selectedOffer.company.com_title}
                  className="h-12 sm:h-16"
                />
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{selectedOffer.offer_title}</h3>
                <p className="text-lg sm:text-xl font-bold">{selectedOffer.offer_code ? selectedOffer.offer_code : 'No coupon code needed'}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-gray-700 font-medium">Offer Description:</p>
                <p className="text-sm sm:text-base text-gray-600">{selectedOffer.offer_description}</p>
              </div>
              <div className="text-center text-sm sm:text-base text-gray-600 mb-4">
                <p>Expiration Date: {new Date(selectedOffer.offer_expiry).toLocaleDateString()}</p>
              </div>
              <div className="w-full bg-[#2F3841] p-4 rounded-lg text-white flex flex-col justify-center items-center text-center">
                <p className="text-sm font-semibold mb-2">Get coupon alerts for {selectedOffer.company.com_title} and never miss another deal!</p>
                <input
                  id="userInput"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 w-full"
                  placeholder="Type something..."
                />
                <button
                  onClick={() => window.open(selectedOffer.redeem_link, '_blank')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-2"
                >
                  {selectedOffer.offer_code ? 'Continue to this offer' : 'Redeem at ' + selectedOffer.company.com_title}
                </button>
                <p className="text-xs mt-2">No spam, just savings. Read our Privacy Policy for more info.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerRootLayout>
  );
};

export default OffersPage;
