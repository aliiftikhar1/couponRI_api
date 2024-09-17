"use client";
import { useState } from 'react';
import Cookies from 'js-cookie';
import {
  FaSignOutAlt,
  FaChevronDown,
  FaBuilding,
  FaTags,
  FaBlog,
  FaCog,
  FaQuestionCircle,
  FaPercent,
  FaTicketAlt,
  FaInbox,
  FaFolderOpen,
} from 'react-icons/fa';

const menuItems = [
  {
    title: "CouponRI",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <FaCog />,
      },
    ],
  },
];

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({});

  const toggleDropdown = (key) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/admin';
  };

  return (
    <div className="bg-gray-700 text-white w-full min-h-screen flex flex-col">
      {/* Profile Section */}
      <div className="p-6 text-center">
        <img
          src="/logo/logo.jpg"
          alt="Profile"
          className="rounded-full mx-auto mb-4 w-24 h-24"
        />
        <h2 className="text-xl font-semibold">CouponRI</h2>
        <p className="text-green-400 mt-1">● Online</p>
      </div>

      {/* Menu Section */}
      <div className="flex-1 p-4 border-t border-gray-600">
        <ul className="mt-6 space-y-3">
          {/* Permanent Links */}
          <li>
            <a href="/admin/Companies">
              <button className="flex items-center p-3 hover:bg-blue-700 rounded-md w-full">
                <FaBuilding className="h-5 w-5" />
                <span className="ml-3 text-sm font-medium">Companies</span>
              </button>
            </a>
          </li>
          <li>
            <a href="/admin/Categories">
              <button className="flex items-center p-3 hover:bg-blue-700 rounded-md w-full">
                <FaTags className="h-5 w-5" />
                <span className="ml-3 text-sm font-medium">Categories</span>
              </button>
            </a>
          </li>
          <li>
            <a href="/admin/Offers">
              <button className="flex items-center p-3 hover:bg-blue-700 rounded-md w-full">
                <FaPercent className="h-5 w-5" />
                <span className="ml-3 text-sm font-medium">Offers</span>
              </button>
            </a>
          </li>
          <li>
            <a href="/admin/Category_Coupon">
              <button className="flex items-center p-3 hover:bg-blue-700 rounded-md w-full">
                <FaTicketAlt className="h-5 w-5" />
                <span className="ml-3 text-sm font-medium">Category Coupon</span>
              </button>
            </a>
          </li>
          <li>
            <a href="/admin/Submittions">
              <button className="flex items-center p-3 hover:bg-blue-700 rounded-md w-full">
                <FaInbox className="h-5 w-5" />
                <span className="ml-3 text-sm font-medium">Submissions</span>
              </button>
            </a>
          </li>
          <li>
            <a href="/admin/BlogCategories">
              <button className="flex items-center p-3 hover:bg-blue-700 rounded-md w-full">
                <FaFolderOpen className="h-5 w-5" />
                <span className="ml-3 text-sm font-medium">Blog Categories</span>
              </button>
            </a>
          </li>
          <li>
            <a href="/admin/Blogs">
              <button className="flex items-center p-3 hover:bg-blue-700 rounded-md w-full">
                <FaBlog className="h-5 w-5" />
                <span className="ml-3 text-sm font-medium">Blogs</span>
              </button>
            </a>
          </li>
          <li>
            <a href="/admin/Faqs">
              <button className="flex items-center p-3 hover:bg-blue-700 rounded-md w-full">
                <FaQuestionCircle className="h-5 w-5" />
                <span className="ml-3 text-sm font-medium">FAQ's</span>
              </button>
            </a>
          </li>

          {/* Dropdown Menu */}
          {menuItems.map((category, index) => (
            <li key={category.title}>
              <button
                className="flex items-center w-full p-3 hover:bg-blue-700 rounded-md focus:outline-none"
                onClick={() => toggleDropdown(index)}
              >
                <span className="ml-3 text-sm font-medium">{category.title}</span>
                <FaChevronDown
                  className={`h-4 w-4 ml-auto transform transition-transform duration-200 ${
                    isDropdownOpen[index] ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isDropdownOpen[index] && (
                <ul className="ml-6 mt-2 space-y-2">
                  {category.list.map((item) => (
                    <li key={item.title}>
                      <a href={item.path}>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full">
                          {item.icon}
                          <span className="ml-3 text-sm font-medium">{item.title}</span>
                        </button>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Logout Button */}
          <li className="mt-6">
            <button
              className="flex items-center w-full p-3 hover:bg-blue-700 rounded-md focus:outline-none"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="h-5 w-5" />
              <span className="ml-3 text-sm font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
