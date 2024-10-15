import React from "react";
import CompanyDetail from "./mainpage";


export async function generateMetadata({ params }) {
  // const baseUrl = 'http://couponri.com';
  const baseUrl = 'http://localhost:3000';
  console.log("Meta data for : ", params.id);
  try {
    console.log("Meta data is going to fetch....");
    const res = await fetch(`${baseUrl}/api/onecompany/${params.id}`);
    
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      throw new Error('Failed to fetch blog data');
    }

    const result = await res.json();
    const company = result;
console.log("Company is : ",company);
    // Return metadata with the fetched blog title and description
    return {
      title: company.meta_title || 'CouponRI',
      description: company.meta_description|| 'Best coupon website',
      keywords: company.meta_focusKeyword || "Couponri blogs keyword"
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);

    // Provide fallback metadata in case of an error
    return {
      title: 'CouponRI',
      description: 'Best coupon website',
      keywords: 'Couponri blogs keyword'
    };
  }
}




export default function Home({ params }) {
  return (
    <>
      <CompanyDetail id={params.id} />
    </>
  );
}
