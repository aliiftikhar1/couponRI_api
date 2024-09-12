'use client';  // This tells Next.js that this is a client component

import React, { useEffect, useState } from 'react';
import RightSide from '../../../user/components/RightSide';
import LeftSide from '../../../user/components/LeftSide';
import CouponHeader from '../../../user/components/CouponHeader';
import FaqComponent from '../../../user/components/FaqComponent';
import CustomerRootLayout from '../../../user/layout';
import OffersTable from '../../../user/components/CouponTable';
import SimilarStores from '../../../user/components/SImilarStores';

const CompanyDetail = ({ id }) => {
  const [company, setCompany] = useState(null);
  const [offers, setOffers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch company details
        const companyResponse = await fetch(`/api/company/${id}`);
        if (!companyResponse.ok) {
          throw new Error('Failed to fetch company data');
        }
        const companyData = await companyResponse.json();
        setCompany(companyData);

        // Fetch offers related to this company
        const offersResponse = await fetch(`/api/gettingoffers/${id}`);
        if (!offersResponse.ok) {
          throw new Error('Failed to fetch offers data');
        }
        const offersData = await offersResponse.json();
        setOffers(offersData);

        // Fetch FAQs related to this company
        const faqsResponse = await fetch(`/api/gettingfaqs/${id}`);
        if (!faqsResponse.ok) {
          throw new Error('Failed to fetch FAQs data');
        }
        const faqsData = await faqsResponse.json();
        setFaqs(faqsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">{`Error: ${error}`}</div>;
  }

  if (!company) {
    return <div className="flex items-center justify-center min-h-screen bg-yellow-100 text-yellow-700">Company data not found or failed to load.</div>;
  }

  return (
    <>
      <CustomerRootLayout>
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
          <CouponHeader company={company} />
          <div className="container mx-auto flex flex-col md:flex-row gap-4 sm:gap-6">
            <div className="w-full md:w-1/3 p-4 bg-white shadow-md rounded-lg">
              <LeftSide company={company} offers={offers} />
            </div>
            <div className="w-full md:w-2/3 p-4 bg-white shadow-md rounded-lg">
              <RightSide offers={offers} company={company} />
            </div>
          </div>
          <OffersTable offers={offers} company={company} />
          <div className='bg-white p-10 rounded text-xl m-4'>
            <div
              className="text-sm sm:text-base"
              dangerouslySetInnerHTML={{
                __html:
                  company.comp_details ||
                  'No additional details available for this company.',
              }}
            ></div>
          </div>
          
          <SimilarStores company={company} />
          <div className="mt-8 bg-white p-4 sm:p-6 shadow-md rounded-lg">
            <FaqComponent faqs={faqs} companyName={company.com_title} />
          </div>
        </div>
      </CustomerRootLayout>
    </>
  );
};

export default CompanyDetail;
