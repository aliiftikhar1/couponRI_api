import React from "react";
import CompanyDetail from "./mainpage";
import BlogDetailPage from "./mainpage";

export async function generateMetadata({ params }) {
  // Get the base URL from environment variables
  const baseUrl = 'http://couponri.com'; // Fallback to localhost during development

  // Fetch company data using the full URL
  const res = await fetch(`${baseUrl}/api/blog/${params.id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch company data');
  }

  const blog = await res.json();

  // Return metadata with the fetched company title and description
  return {
    title: blog.title || 'CouponRI',
    description: blog.description || 'Best coupon website',
  };
}


export default function Home({ params }) {
  return (
    <>
      <BlogDetailPage id={params.id} />
    </>
  );
}
