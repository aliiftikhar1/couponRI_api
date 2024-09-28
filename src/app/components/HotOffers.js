'use client';
import React, { useEffect, useState, useRef } from 'react';

const HotOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const newTabRef = useRef(null);

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

        const offersWithCompanyDetails = offersData
          .filter(offer => offer.offer_status === 'Hot') // Filter only 'Hot' offers
          .map((offer) => {
            const company = companiesData.find((comp) => comp.id === offer.comp_id);

            // Matching discount formats and capturing the next relevant word
            const discountMatch =
              offer.offer_title.match(/(\d+%)\s*(\w+)/) ||   // Match percentage discount and next word
              offer.offer_title.match(/\$(\d+)\s*(\w+)/) ||  // Match dollar discount and next word
              offer.offer_title.match(/(Free\s\w+)/i);       // Match "Free" offers

            let discountDisplay = null;
            if (discountMatch) {
              if (discountMatch[0].includes('%')) {
                discountDisplay = `${discountMatch[1]} ${discountMatch[2]}`;  // Display percentage with next word
              } else if (discountMatch[0].includes('$')) {
                discountDisplay = `$${discountMatch[1]} ${discountMatch[2]}`; // Display dollar amount with next word
              } else if (discountMatch[0].toLowerCase().includes('free')) {
                discountDisplay = 'Free';                                     // Display "Free"
              }
            }

            return {
              ...offer,
              company,
              discountDisplay,  // Store the formatted discount and next word for display
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
    newTabRef.current = window.open(offer.offer_affiliateLink, '_blank', 'noopener,noreferrer');
    setSelectedOffer(offer);
    setShowPopup(true);
  };

  const handleShowOfferLink = (offer) => {
    window.open(offer.offer_affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const handleButtonClick = (offer) => {
    if (offer.offer_type === 'Code') {
      handleShowPopup(offer);
    } else if (offer.offer_type === 'Offer') {
      handleShowOfferLink(offer);
    }
  };

  const handleClosePopup = () => {
    setSelectedOffer(null);
    setShowPopup(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
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
    <div className="bg-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-black mb-8">Hot Offers</h1>
      <div className="container mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300 transition-transform duration-300 hover:scale-105">
            <div className="relative pb-56">
              <img
                src={`https://m3xtrader.com/coupon/uploads/${offer.company.comp_logo}`}
                alt={offer.company.com_title}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              />
              {offer.discountDisplay && (
                <div className="absolute top-2 left-2 bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded">
                  {offer.discountDisplay}  {/* Display discount with the next word */}
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                HOT OFFER
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{offer.company.com_title}</h3>
              <p className="text-sm text-gray-900 font-semibold mb-2">{offer.offer_title}</p>
              <span className="flex justify-end">
                <button
                  onClick={() => handleButtonClick(offer)}
                  className="bg-[#06089B] text-white w-full h-10 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  {offer.offer_type === 'Code' ? 'Show Code' : 'Get Offer'}
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>

      {showPopup && selectedOffer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] max-w-xl relative flex flex-col justify-between">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              &times;
            </button>
            <div className="flex items-center justify-center mb-4">
              <img
                src={`https://m3xtrader.com/coupon/uploads/${selectedOffer.company.comp_logo}`}
                alt={selectedOffer.company.com_title}
                className="h-16"
              />
            </div>
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold mb-2">{selectedOffer.offer_title}</h3>
              <p className="text-lg font-bold">{selectedOffer.offer_code ? selectedOffer.offer_code : 'No coupon code needed'}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-gray-700 font-medium">Offer Description:</p>
              <p className="text-sm text-gray-600">{selectedOffer.offer_description}</p>
            </div>
            <div className="text-center text-sm text-gray-600 mb-4">
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
                placeholder="Type your email..."
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
  );
};

export default HotOffers;
