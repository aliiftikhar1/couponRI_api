'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';
import CustomerRootLayout from '../../user/layout';

const CompanyCard = ({ company, topDiscount }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 relative">
      <div className="flex justify-end items-center mb-4">
        <span className="bg-white text-gray-900 text-xs font-bold rounded-full px-2 py-1 shadow-lg">
          {topDiscount !== 'Not Available' ? topDiscount : 'Not Available'}
        </span>
      </div>
      <div className="h-[150px]">
        <img
          src={`https://m3xtrader.com/coupon/uploads/${company.comp_logo}`}
          alt={company.com_title}
          className="w-full h-full object-contain mb-4"  // Use object-contain to maintain aspect ratio
        />
      </div>
      <div className="h-full">
        <h3 className="text-sm font-semibold text-gray-700 my-3">{company.com_title}</h3>
        <div className='flex'>
          <a
            href={`/store/${company.web_slug}`}
            className="bg-[#06089B] text-white  h-10 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 mt-2"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

const CategoryDetail = ({params}) => {
  // const params = useParams();
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [topDiscounts, setTopDiscounts] = useState({});
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = params.id;
  console.log("Params are: ",id);
  

  const getidfromslug = async (id) => {
    try {
      console.log("id sent to API is:", id);
      const response = await fetch(`/api/getidfromslug/${id}`);
      
      // Ensure the response is successfully fetched
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      
      const data = await response.json();  // await the JSON response
      const newid = data.id;
      console.log("New Category id is:", newid);
      
      return newid; // Return the category id for further use
    } catch (error) {
      console.error("Error Fetching category:", error);
      throw new Error("Error fetching category");
    }
  };
  
  useEffect(() => {
    const fetchCategoriesAndOffers = async () => {
    console.log("Old id is : ",id);
      const newid = await getidfromslug(id);
      console.log("newid is ",newid);
      try {
        const [categoriesResponse, companiesResponse, categoryResponse, offersResponse] = await Promise.all([
          fetch('/api/category'),
          fetch('/api/onecategorycompanies/' + id),
          fetch(`/api/category/${newid}`),
          fetch('/api/offers')
        ]);

        if (!categoriesResponse.ok || !companiesResponse.ok || !categoryResponse.ok || !offersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const categoriesData = await categoriesResponse.json();
        const companiesData = await companiesResponse.json();
        const categoryData = await categoryResponse.json();
        const offersData = await offersResponse.json();

        setCategories(categoriesData);
        setCompanies(companiesData);
        setCategory(categoryData);

        const discounts = {};
        offersData.forEach((offer) => {
          let discount = 'Not Available';

          // Check for percentage discounts
          const percentageMatch = offer.offer_title.match(/^(\d+)%/);
          if (percentageMatch) {
            discount = `${percentageMatch[1]}% OFF`;
          }

          // Check for dollar discounts
          const dollarMatch = offer.offer_title.match(/\$(\d+)(?: OFF)?/);
          if (dollarMatch) {
            discount = `$${dollarMatch[1]} OFF`;
          }

          // Check for free offers
          if (offer.offer_title.toLowerCase().includes('free')) {
            discount = 'FREE';
          }

          const companyId = offer.comp_id;
          if (!discounts[companyId] || discounts[companyId] !== 'FREE') {
            discounts[companyId] = discount;
          }
        });

        const discountWithFallback = {};
        companiesData.forEach((company) => {
          discountWithFallback[company.id] = discounts[company.id] || 'Not Available';
        });

        setTopDiscounts(discountWithFallback);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndOffers();
  }, [params]);
  // useEffect(() => {
  //   if (category && category.web_slug) {
  //     // Use history.replaceState to change the URL without a page reload
  //     window.history.replaceState(null, '', `/category/${category.web_slug}`);
  //   }
  // }, [category]);

  const handleCategoryClick = (categoryId) => {
    router.push(`/category/${categoryId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">{`Error: ${error}`}</div>;
  }

  if (!companies.length) {
    return <div className="flex items-center justify-center min-h-screen bg-yellow-100 text-yellow-700">No companies found for this category.</div>;
  }

  

  return (
    <CustomerRootLayout>
      <div className="flex flex-col md:flex-row bg-gray-50">
        {/* Sidebar for categories (hidden on mobile) */}
        <div className="hidden md:block w-1/5 bg-white p-4 shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-6">Categories</h2>
          <ul className="space-y-4">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between cursor-pointer group p-2 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-md"
                onClick={() => handleCategoryClick(category.web_slug)}
              >
                <span className="text-black group-hover:scale-105 group-hover:text-white transform transition-transform duration-300">
                  {category.category_name}
                </span>
                <FaArrowRight className=" pl-1 text-black opacity-0 group-hover:opacity-100 transform transition-opacity duration-300 group-hover:text-white" />
              </li>
            ))}
          </ul>
        </div>

        {/* Main content for companies */}
        <div className="flex-1 p-4 md:p-6">
          <div className="my-4 md:my-8">
            <h1 className="text-center text-2xl md:text-4xl font-bold text-[#06089B]">
              {category ? `${category.category_name} Stores` : 'Category Store'}
            </h1>
            {category && (
              <p className="text-center text-sm md:text-lg text-gray-600 mt-2 md:mt-4">
                {category.category_description || 'No description available.'}
              </p>
            )}
          </div>
          <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {companies.map((company) => (
              <div key={company.id} className="p-2 md:p-4">
                <CompanyCard company={company} topDiscount={topDiscounts[company.id]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomerRootLayout>
  );
};

export default CategoryDetail;
