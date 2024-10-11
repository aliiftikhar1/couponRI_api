'use client';
import { useState, useEffect } from 'react';
import CustomerRootLayout from '../user/layout';

export default function BlogCategories() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch blogs from API
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogcategory');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <CustomerRootLayout>
      <div className="bg-gray-50 py-12">
        <main className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Blog Categories</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-white via-gray-100 to-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:via-blue-100 hover:to-blue-200"
              >
                <div className="absolute top-0 right-0 m-4 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm">
                  #{index + 1}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{blog.title}</h2>
                <p className="text-gray-700 mb-6">{blog.description}</p>
                <a href={`/blogcategories/${blog.title}`}>
                <button className="bg-transparent border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-300">
                  View Blogs
                </button>
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    </CustomerRootLayout>
  );
}
