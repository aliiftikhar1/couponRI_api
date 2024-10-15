import React from "react";
import BlogDetailPage from "./mainpage"; // Ensure you are importing the correct component

export async function generateMetadata({ params }) {
  const baseUrl = 'http://couponri.com';
  // const baseUrl = 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/blog/${params.id}`);
    
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      throw new Error('Failed to fetch blog data');
    }

    const blog = await res.json();
    console.log("Meta data is : ", blog);
    console.log("Meta data is : ", blog.meta_title)
    // Return metadata with the fetched blog title and description
    return {
      title: blog.meta_title || 'CouponRI',
      description: blog.meta_description || 'Best coupon website',
      keywords: blog.meta_focusKeyword || "Couponri blogs keyword"
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
      <BlogDetailPage id={params.id} />
    </>
  );
}
