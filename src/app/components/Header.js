'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b-2 text-black px-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center ">
          <a href="/">
            <img src="/logo/logo.jpg" alt="Logo" className="md:w-40 w-24" />
          </a>
        </div>
        
        {/* Navigation for Desktop */}
        <nav className="hidden lg:flex text-lg space-x-8 text-sm font-semibold">
          <a href="/pages/blog" className="hover:text-blue-700">
            Blog
          </a>
          <a href="/pages/categories" className="hover:text-blue-700">
            Categories
          </a>
          <a href="/pages/stores" className="hover:text-blue-700">
            Stores
          </a>
          <a href="/pages/alloffers" className="hover:text-blue-700">
            Coupons
          </a>
          <a href="/pages/submitoffer" className="hover:text-blue-700">
            Submit Offer
          </a>
        </nav>

        {/* Search Icon for Desktop */}
        <div className="hidden lg:flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5 text-black cursor-pointer hover:text-blue-700" />
          <span className="ml-2 cursor-pointer hover:text-blue-700">Search</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-black focus:outline-none"
        >
          &#9776; {/* Hamburger icon */}
        </button>
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-0 z-50 right-0 h-full w-64 bg-white shadow-lg transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={toggleMenu} className="text-black focus:outline-none">
            &times; {/* Close icon */}
          </button>
        </div>
        <nav className="p-4 space-y-4">
          <a href="/pages/blog" className="block hover:text-blue-700">
            Blog
          </a>
          <a href="/pages/categories" className="block hover:text-blue-700">
            Categories
          </a>
          <a href="/pages/stores" className="block hover:text-blue-700">
            Stores
          </a>
          <a href="/pages/alloffers" className="block hover:text-blue-700">
            Coupons
          </a>
          <a href="/pages/submitoffer" className="block hover:text-blue-700">
            Submit Offer
          </a>

          {/* Search Option for Mobile */}
          <div className="flex items-center pt-4 border-t mt-4">
            <MagnifyingGlassIcon className="h-5 w-5 text-black cursor-pointer hover:text-blue-700" />
            <span className="ml-2 cursor-pointer hover:text-blue-700">Search</span>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}
    </header>
  );
}
