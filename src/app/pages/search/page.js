'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Importing useRouter
import CompanyCard from "./component/companycard"
import CustomerRootLayout from "../../user/layout"

export default function Home() {
  const router = useRouter();
  const { query } = router; // Accessing query parameters from the router
  const searchQuery = query.query; // Getting the 'query' parameter from the URL
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the stores based on the query parameter
    const fetchStores = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/searchStore?query=${searchQuery}`);
        if (response.ok) {
          const data = await response.json();
          setStores(data); // Store the fetched data
        } else {
          setError('Failed to fetch stores');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchStores(); // Fetch stores when query is present
    }
  }, [searchQuery]);

  if (loading) {
    return <p className="text-center text-xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-600">{error}</p>;
  }

  return (
    <CustomerRootLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Search Results for "{searchQuery}"</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stores.length > 0 ? (
            stores.map((store) => (
              <CompanyCard 
                key={store.id}
                company={store}
                topDiscount={store.topDiscount || 'Not Available'} // Adjust the logic for topDiscount based on your data
              />
            ))
          ) : (
            <p className="col-span-full text-center text-lg">No stores found</p>
          )}
        </div>
      </div>
    </CustomerRootLayout>
  );
}
