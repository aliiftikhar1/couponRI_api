import React from "react";
import CompanyDetail from "./mainpage";

export async function generateMetadata({ params }) {
  // Get the base URL from environment variables
  const baseUrl = 'http://couponri.com'; // Fallback to localhost during development

  // Fetch company data using the full URL
  const res = await fetch(`${baseUrl}/api/company/${params.id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch company data');
  }

  const company = await res.json();

  // Return metadata with the fetched company title and description
  return {
    title: company.com_title || 'CouponRI',
    description: company.comp_description || 'Best coupon website',
  };
}


export default function Home({ params }) {
  return (
    <>
      <CompanyDetail id={params.id} />
    </>
  );
}
