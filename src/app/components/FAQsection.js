'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'; // Ensure Heroicons v2 is installed

const FAQSection = ({ imageSrc }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { 
      question: 'What is CouponRI.com?', 
      answer: 'CouponRI is the one-stop online shopping portal of coupons, promo code and discount offers for online shopping in different verticals such as fashion, electronics and home decor amongst many others. At CouponRI.com, we help you in saving money on your favorite brands and products.' 
    },
    { 
      question: 'How do I use a promo code from CouponRI?', 
      answer: 'Using a Promo Codes from CouponRI is as easy as 1-2-3. Find your code, click to reveal, and copy. Then, on the checkout on retailer\'s website paste your code for instantly applying your discount.' 
    },
    { 
      question: 'How do I know about new coupons?', 
      answer: 'Stay ahead in the savings game by subscribing to our newsletter or following us on social media. We\'ll send you the hottest discount offers, coupon codes, and online shopping tips to save money deals right to your inbox.' 
    },
    { 
      question: 'How often are coupon & discount offers updated?', 
      answer: 'Our team is regularly updating promo codes and discount deals to ensure that you will always have access to the most current and efficient deals. Check back frequently to make sure that you are not missing the new savings.' 
    },
    { 
      question: 'Does CouponRI offer exclusive discounts?', 
      answer: 'Yes, CouponRI provides exclusive discounts and voucher codes not found on any other platform. That is because we keep partnering with leading brands for the best possible offers, so you need to visit our site quite often.' 
    },
  ];

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-6 bg-white border-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <ul className="space-y-4">
            {faqs.map((faq, index) => (
              <li key={index} className="border-b pb-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleDropdown(index)}
                >
                  <h3 className="text-lg font-semibold">
                    {faq.question}
                  </h3>
                  <span>
                    {openIndex === index ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </span>
                </div>
                {openIndex === index && (
                  <div className="mt-2 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Image */}
        <div className="flex md:flex-row flex-col justify-center h-auto md:h-full">
          <div className="md:w-[400px] md:h-[400px] w-full h-full">
            <img
              src="/footer/couponri.png" // Replace with the correct path to your image
              alt="Shopping Illustration"
              className="w-full h-full object-fill" // Ensures the image covers the entire container
            />
          </div>
          <div className="w-full md:w-1/2 text-black text-center md:text-left p-4 mt-4">
                <h1 className="text-4xl md:text-3xl font-bold mb-4">
                  Get Unlimited Coupons <span className="text-black">#CouponRI</span>
                </h1>
                <p className="text-lg md:text-lg mb-6">
                  Make Your Shopping Experience Marvelous with These Store's Coupons & Deals
                </p>
                <a href='/pages/alloffers' className='flex justify-center'>
                <button className="bg-[#010990] text-lg text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition duration-300">
                  Get Coupons Code
                </button>
                </a>
              </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
