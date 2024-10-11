'use client';

import React, { useEffect, useState, useRef } from 'react';

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category'); // Adjust this URL to your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch categories data');
        }
        const categoriesData = await response.json();

        // Filter categories to include only those with status "Top"
        const topCategories = categoriesData.filter(
          (category) => category.category_status === 'Top'
        );

        setCategories([...topCategories, ...topCategories]); // Duplicate for infinite scrolling
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!loading && sliderRef.current && categories.length > 0) {
      const slider = sliderRef.current;
      let startX;
      let scrollLeft;
      let autoScroll;

      const startSlide = () => {
        setIsSliding(true);
        slider.scrollLeft += 1;
        autoScroll = setInterval(() => {
          slider.scrollLeft += 1;
          if (slider.scrollLeft >= slider.scrollWidth / 2) {
            slider.scrollLeft = 0; // Reset the scroll to the beginning
          }
        }, 10); // Adjust speed
      };

      const stopSlide = () => {
        setIsSliding(false);
        clearInterval(autoScroll);
      };

      slider.addEventListener('mouseenter', stopSlide);
      slider.addEventListener('mouseleave', startSlide);

      startSlide(); // Start sliding on page load

      return () => {
        slider.removeEventListener('mouseenter', stopSlide);
        slider.removeEventListener('mouseleave', startSlide);
        clearInterval(autoScroll);
      };
    }
  }, [loading, categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">{`Error: ${error}`}</div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">Top Categories</h2>

      {/* Custom horizontally scrollable slider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={sliderRef}
          className="flex justify-start items-center space-x-12 overflow-x-hidden scroll-smooth pb-4 p-4 whitespace-nowrap"
          style={{ cursor: isSliding ? 'grabbing' : 'grab' }}
        >
          {categories.map((category, index) => (
            <a
              key={index}
              href={`/category/${category.web_slug}`}
              className="inline-block duration-300 ease-in-out text-center transform hover:scale-105"
            >
              <div className="w-40 h-40 sm:w-40 sm:h-40 mx-auto overflow-hidden rounded-full border-4 border-gray-300">
                <img
                  src={`https://m3xtrader.com/coupon/uploads/${category.category_image}`} // Replace with the correct path to the images
                  alt={category.cat_title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-center text-md sm:text-md font-semibold mt-4">
                {category.category_name}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;
