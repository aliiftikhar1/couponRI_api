'use client';

import React, { useEffect, useState } from 'react';

const FeaturedStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleRows, setVisibleRows] = useState(2); // To control how many rows are visible

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/company'); // Adjust this URL to your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch stores data');
        }
        const storesData = await response.json();
        setStores(storesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleShowMore = () => {
    setVisibleRows((prevRows) => prevRows + 2); // Show 2 more rows
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">{`Error: ${error}`}</div>;
  }

  // Calculate how many stores to display based on visibleRows
  const storesPerRow = 5; // Assuming you want 5 stores per row
  const visibleStores = visibleRows * storesPerRow;

  return (
    <div className="py-12 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Stores</h2>
      <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 sm:px-6 lg:px-8">
        {stores.slice(0, visibleStores).map((store) => (
          <a href={`/pages/onecompany/${store.id}`} key={store.id}>
            <div className=" p-4 flex items-center justify-center  transition-shadow duration-300 ease-in-out">
              <img
                src={`https://m3xtrader.com/coupon/uploads/${store.comp_logo}`} // Replace with the correct path to the images
                alt={store.com_title}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full hover:shadow-xl" // Circular image
              />
            </div>
          </a>
        ))}
      </div>

      {/* Show More Button */}
      {visibleStores < stores.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedStores;
