import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useRef } from 'react';

const RightSide = ({ offers, company }) => {
  const offersArray = Array.isArray(offers) ? offers : [];

  if (offersArray.length === 0) {
    return <div>No offers set by this company.</div>;
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Verified Coupons</h2>
      <div className="space-y-4">
        {offersArray.map((offer, index) => (
          <OfferCard key={index} offer={offer} company={company} />
        ))}
      </div>
    </div>
  );
};

const OfferCard = ({ offer, company }) => {
  const newTabRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Function to parse offer title for % discounts, $ discounts, or Free offers
  const getOfferDetails = (title) => {
    let leftSideText = '';
    let rightSideText = '';
    let offerType = '';

    // Check for percentage discount first
    const percentageMatch = title.match(/(\d+)%/);
    if (percentageMatch) {
      leftSideText = `${percentageMatch[1]}%`; // Include the percentage sign
      rightSideText = 'OFF'; // Display "OFF" below the percentage value
      offerType = 'percentage';
    } else {
      // Check for dollar discount
      const dollarMatch = title.match(/\$(\d+)/);
      if (dollarMatch) {
        leftSideText = `$${dollarMatch[1]}`; // Include the dollar sign
        rightSideText = 'OFF'; // Display "OFF" below the dollar value
        offerType = 'dollar';
      } else {
        // Check for "Free" offer
        if (title.toLowerCase().includes('free')) {
          leftSideText = 'Free'; // Display "Free"
          rightSideText = 'Shipping'; // Or any other relevant word
          offerType = 'free';
        }
      }
    }

    return { leftSideText, rightSideText, offerType };
  };

  const { leftSideText, rightSideText, offerType } = getOfferDetails(offer.offer_title);

  const handleShowCode = (offer) => {
    newTabRef.current = window.open(offer.offer_affiliateLink, '_blank', 'noopener,noreferrer');
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-start border-b border-gray-200 relative">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center">
          {/* Display the offer value and the sign (e.g., %, $, or Free) */}
          <span className="text-blue-600 text-xl sm:text-2xl font-bold">{leftSideText}</span>
          <span className="text-gray-600 text-sm">{rightSideText}</span> {/* Display the word below */}
          {/* Display "Code" or "Free" based on offer type */}
          {offerType !== 'Code' ? (
            <span className="bg-orange-400 text-white text-xs font-bold rounded px-2 py-1 mt-2">Code</span>
          ) : (
            <span className="bg-green-500 text-white text-xs font-bold rounded px-2 py-1 mt-2">Offer</span>
          )}
        </div>
        <div className="ml-4 grid grid-cols-6 w-full">
          <div className='col-span-5'>
            <h3 className="text-lg sm:text-xl font-semibold mb-1">{offer.offer_title}</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-2">{offer.offer_description}</p>
            <p className="text-sm text-gray-500 flex items-center">
              <FaCheckCircle className="text-blue-600 mr-1" /> Verified coupon
            </p>
          </div>
          <div className='absolute top-6 right-10'>
            <button
              onClick={() => handleShowCode(offer)} // Pass the function reference correctly here
              className="mt-4 bg-[#07069F] text-white w-full sm:w-auto h-10 text-sm font-semibold px-4 py-2 rounded hover:bg-blue-700 transition-transform duration-300"
            >
              Show Code
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              &times;
            </button>
            <img
              src={`https://m3xtrader.com/coupon/uploads/${company.comp_logo}`}
              alt={company.com_title}
              className="h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2 text-center">{offer.offer_title}</h3>
            <p className="text-lg text-center font-bold mb-4">
              {offer.offer_code ? offer.offer_code : 'No coupon code needed'}
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mb-4"
              onClick={() => window.open(offer.redeem_link, '_blank')}
            >
              {offer.offer_code ? 'Continue to this offer' : 'Redeem at ' + company.com_title}
            </button>
            <div className="bg-gray-100 p-4">
              <p className="text-lg text-gray-700">Offer Description:</p>
              <p className="text-sm text-gray-600 mb-2">{offer.offer_description}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Expiration Date: {offer.offer_expiry}</p>
            </div>
            <div className="relative mb-0 w-full bg-[#2F3841] h-40 my-4">
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
                <p className="text-sm font-semibold mb-2">
                  Get coupon alerts for {company.com_title} and never miss another deal!
                </p>
                <label htmlFor="userInput" className="text-sm font-medium mb-1">
                  Your Input:
                </label>
                <input
                  id="userInput"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
                  placeholder="Type something..."
                />
                <p className="text-xs">No spam, just savings. Read our Privacy Policy for more info.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSide;
