'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchText(''); // Clear search text when closing search input
  };

  const handleSearchSubmit = () => {
    if (searchText.trim() !== '') {
      router.push(`/pages/search?query=${searchText}`);
      setIsSearchOpen(true); // Hide the search input after submission
    }
  };

  return (
    <header className="bg-white  py-2 border-b-2 text-black px-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/">
            <img src="/logo/logo2.jpg" alt="Logo" className="md:w-40 md:py-1 w-24" />
          </a>
        </div>

        {/* Navigation for Desktop */}
        <nav className="hidden lg:flex text-md space-x-8  font-semibold">
          <a href="/blog" className="hover:text-blue-700">
            Blog
          </a>
          <a href="/blogcategories" className=" hover:text-blue-700">
            Blog Categories
          </a>
          <a href="/store" className=" hover:text-blue-700">
            Stores
          </a>
          <a href="/categories" className=" hover:text-blue-700">
            Store Categories
          </a>
          <a href="/pages/alloffers" className="hover:text-blue-700">
            Coupons
          </a>
          <a href="/pages/submitoffer" className="hover:text-blue-700">
            Submit Offer
          </a>
        </nav>

        {/* Search Icon and Input for Desktop */}
        <div className="hidden lg:flex items-center">
          {isSearchOpen ? (
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border border-gray-300 rounded-lg py-1 px-3"
                placeholder="Search..."
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-0 top-0 h-full px-3 text-black"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <MagnifyingGlassIcon
              className="h-5 w-5 text-black cursor-pointer hover:text-blue-700"
              onClick={handleSearchToggle}
            />
          )}
           <div className="flex space-x-3 ml-4">
    <a href="https://www.facebook.com/couponri/" target="_blank" rel="noopener noreferrer">
      <FaFacebookF className="text-black hover:text-blue-700" />
    </a>
    <a href="https://x.com/CouponRi" target="_blank" rel="noopener noreferrer">
      <FaTwitter className="text-black hover:text-blue-700" />
    </a>
    <a href="https://www.instagram.com/coupon_ri/" target="_blank" rel="noopener noreferrer">
      <FaInstagram className="text-black hover:text-blue-700" />
    </a>
    <a href="https://youtube.com/@couponri" target="_blank" rel="noopener noreferrer">
      <FaYoutube className="text-black hover:text-blue-700" />
    </a>
  </div>
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
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={toggleMenu} className="text-black focus:outline-none">
            &times; {/* Close icon */}
          </button>
        </div>
        <nav className="p-4 space-y-4">
          <a href="/blog" className="block hover:text-blue-700">
            Blog
          </a>
          <a href="/blogcategories" className="block hover:text-blue-700">
            Blog Categories
          </a>
          <a href="/store" className="block hover:text-blue-700">
            Stores
          </a>
          <a href="/categories" className="block hover:text-blue-700">
            Store Categories
          </a>
          <a href="/pages/alloffers" className="block hover:text-blue-700">
            Coupons
          </a>
          <a href="/pages/submitoffer" className="block hover:text-blue-700">
            Submit Offer
          </a>

          {/* Search Option for Mobile */}
          <div className="flex flex-col items-center gap-8 pt-4 border-t mt-4">
            <div className='flex '>
  <MagnifyingGlassIcon
    className="h-10 w-10 text-black cursor-pointer hover:text-blue-700"
    onClick={handleSearchToggle}
  />
  {isSearchOpen && (
    <input
      type="text"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      className="ml-2 border border-gray-300 rounded-lg py-1 px-3 w-full"
      placeholder="Search..."
      onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
    />
  )}
</div>
  <div className="flex space-x-10 ml-4 text-2xl">
    <a href="https://www.facebook.com/couponri/" target="_blank" rel="noopener noreferrer">
      <FaFacebookF className="text-black hover:text-blue-700" />
    </a>
    <a href="https://youtube.com/@couponri" target="_blank" rel="noopener noreferrer">
      <FaTwitter className="text-black hover:text-blue-700" />
    </a>
    <a href="https://www.instagram.com/coupon_ri/" target="_blank" rel="noopener noreferrer">
      <FaInstagram className="text-black hover:text-blue-700" />
    </a>
    <a href="https://youtube.com/@couponri" target="_blank" rel="noopener noreferrer">
      <FaYoutube className="text-black hover:text-blue-700" />
    </a>
  </div>
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
