'use client';
import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [trendingOffers, setTrendingOffers] = useState([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category_coupon'); // Adjust the API endpoint as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchTrendingOffers = async () => {
      try {
        const response = await fetch('/api/offers'); // Adjust the API endpoint as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch trending offers');
        }
        const data = await response.json();
        console.log("Footer data: ",data);
        const filtereddata = data
        .filter(offer => offer.offer_status === 'Best Selling')
        console.log("Filtered data: ",filtereddata);
        setTrendingOffers(filtereddata);
      } catch (error) {
        console.error('Error fetching trending offers:', error);
      }
    };
    
    fetchCategories();
    fetchTrendingOffers();
  }, []);

  return (
    <footer className="bg-white text-gray-700 pt-12">
      <div className="container mx-auto px-6">
        {/* Footer Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          {/* Logo and Description */}
          <div className="md:w-1/2">
            <img src="/logo/logo.jpg" alt="CouponRI" className=" h-24" />
            <p className="text-gray-600">
            CouponRI helps you save money by providing and listing the most current promo codes, coupon codes, and discount deals available for top online retailers. Should you make a purchase using the discount links or voucher codes provided by us, we earn a commission. For your further assurance of saving maximum, we will be obliged if you check the validity of any coupon or promo code on the website of the retailer where you intend to make the purchase. For more discounts, visit our blog for expert shopping tips, hot sales, and top product recommendations.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full md:w-3/4">
            {/* About CouponRI */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Site Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/pages/aboutus" className="text-gray-600 hover:text-black">About Us</a>
                </li>
                <li>
                  <a href="/pages/contactus" className="text-gray-600 hover:text-black">Contact Us</a>
                </li>
                <li>
                  <a href="/pages/submitoffer" className="text-gray-600 hover:text-black">Submit Coupon</a>
                </li>
                <li>
                  <a href="/blogs" className="text-gray-600 hover:text-black">Blogs</a>
                </li>
                <li>
                  <a href="/store" className="text-gray-600 hover:text-black">Stores</a>
                </li>
                <li>
                  <a href="/pages/privacypolicy" className="text-gray-600 hover:text-black">Privacy Policy</a>
                </li>
              </ul>
            </div>

             {/* Browse Coupons */}
             <div className="space-y-4">
              <h3 className="text-xl font-bold">Special Offers</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a href={`/pages/categorycoupons/${category.id}`} className="text-gray-600 hover:text-black">
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Special Discounts */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Top Coupons</h3>
              <ul className="space-y-2">
                
                  <li >
                    <a href={`/category/apparel-coupons`} className="text-gray-600 hover:text-black">
                     Apparel
                    </a>
                  </li>
                  <li >
                    <a href={`/category/Footwear`} className="text-gray-600 hover:text-black">
                     Shoes
                    </a>
                  </li>
                  <li >
                    <a href={`/category/Digital-Services`} className="text-gray-600 hover:text-black">
                     Digital Services
                    </a>
                  </li>
                  <li >
                    <a href={`/category/beauty-and-personal-care`} className="text-gray-600 hover:text-black">
                     Health And Beauty
                    </a>
                  </li>
                  <li >
                    <a href={`/category/Electronics`} className="text-gray-600 hover:text-black">
                     Electronics
                    </a>
                  </li>
                  <li >
                    <a href={`/category/Home-and-Garden`} className="text-gray-600 hover:text-black">
                     Home Decor
                    </a>
                  </li>
                  <li >
                    <a href={`/category/beauty-and-personal-care`} className="text-gray-600 hover:text-black">
                     Health & Beauty
                    </a>
                  </li>
                
              </ul>

              <div className="flex space-x-8 mt-6">
                {/* Social Media Icons using React Icons */}
                <a href="https://www.facebook.com/couponri/" aria-label="Facebook" className="text-gray-700 hover:text-black">
                  <FaFacebookF className="w-6 h-6" />
                </a>
                <a href="https://x.com/CouponRi" aria-label="Twitter" className="text-gray-700 hover:text-black">
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/coupon_ri/" aria-label="Instagram" className="text-gray-700 hover:text-black">
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a href="https://youtube.com/@couponri" aria-label="Instagram" className="text-gray-700 hover:text-black">
                  <FaYoutube className="w-6 h-6" />
                </a>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </footer>
  );
}
