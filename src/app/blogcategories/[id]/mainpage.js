'use client';

import React, { useState, useEffect } from 'react';
import CustomerRootLayout from '../../user/layout';

const BlogDetailPage = ({ id }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (id) {
      const fetchCategoryData = async () => {
        try {
          const response = await fetch(`/api/blogcategoryslug/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch category details');
          }
          const data = await response.json();
          setCategory(data);
        } catch (error) {
          setError(error.message);
        }
      };

      const fetchBlogs = async () => {
        try {
          const response = await fetch(`/api/categoryblogsslug/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch blogs');
          }
          const data = await response.json();
          setBlogs(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCategoryData();
      fetchBlogs();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (blogs.length === 0) {
    return <div className="text-center text-red-500">No blogs found</div>;
  }

  return (
    <CustomerRootLayout>
      <div className="container bg-white h-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 lg:mb-12 text-center text-gray-800">
          {category.title}
        </h1>
        <p className="text-lg mb-8 lg:mb-12 text-center text-gray-600 max-w-2xl mx-auto">
          {category.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={`https://m3xtrader.com/coupon/uploads/${blog.image}`}
                  alt={blog.title}
                  className="w-full h-[200px] sm:h-[300px] object-cover"
                />
                {/* <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-white text-blue-500 py-2 px-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-colors duration-300"
                    onClick={() => window.location.href = `/blog/${blog.web_slug}`}
                  >
                    Read More
                  </button>
                </div> */}
              </div>

              <div className="p-6">
                <a href={`/blog/${blog.web_slug}`}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{blog.title}</h2>
                </a>
                {/* Description limited to 3 lines */}
                <div
                  className="text-base text-gray-600 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                ></div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <button
                    className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
                    onClick={() => window.location.href = `/blog/${blog.web_slug}`}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerRootLayout>
  );
};

export default BlogDetailPage;
