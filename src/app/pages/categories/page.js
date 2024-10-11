'use client';

import React, { useEffect, useState } from 'react';
import CustomerRootLayout from '../../../app/user/layout';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category'); // Adjust this URL to your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch categories data');
        }
        const categoriesData = await response.json();

        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">
        {`Error: ${error}`}
      </div>
    );
  }

  return (
    <CustomerRootLayout>
      <div className="py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">Top Categories</h2>

        {/* Responsive grid layout */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.web_slug}`}
                className="duration-300 ease-in-out text-center transform hover:scale-105"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto overflow-hidden rounded-full border-4 border-gray-300">
                  <img
                    src={`https://m3xtrader.com/coupon/uploads/${category.category_image}`} // Replace with the correct path to the images
                    alt={category.cat_title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-center text-sm sm:text-md font-semibold mt-4">
                  {category.category_name}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </CustomerRootLayout>
  );
};

export default CategoryPage;
