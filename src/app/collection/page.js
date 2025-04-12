"use client";
import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FaSearch, FaUserAlt, FaChevronDown, FaBars, FaTimes, FaWallet } from "react-icons/fa";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletProvider } from '../../../walletconnect';

// Custom ConnectWallet component
const CustomConnectWallet = ({ isMobile }) => {
  return (
    <div className="custom-connect-wallet">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className={`bg-pink-500 border-2 border-black text-white font-bold ${isMobile ? 'py-1 px-2 text-xs' : 'py-2 px-4 text-sm'} rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors`}
                    >
                      <FaWallet className={`${isMobile ? 'mr-1' : 'mr-2'}`} />
                      {isMobile ? 'Connect' : 'Connect Wallet'}
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className={`bg-red-500 border-2 border-black text-white font-bold ${isMobile ? 'py-1 px-2 text-xs' : 'py-2 px-4 text-sm'} rounded-lg flex items-center justify-center`}
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className={`bg-pink-500 border-2 border-black text-white font-bold ${isMobile ? 'py-1 px-2 text-xs' : 'py-2 px-4 text-sm'} rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors`}
                  >
                    {isMobile 
                      ? `${account.displayName.slice(0, 4)}...${account.displayName.slice(-4)}`
                      : `${account.displayName} ${account.displayBalance ? `(${account.displayBalance})` : ''}`
                    }
                  </button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const hamburgerBtn = document.getElementById('hamburger-button');
      
      if (sidebarOpen && sidebar && !sidebar.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const toggleSearchBar = () => {
    setSearchVisible(!searchVisible);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigateToProfile = () => {
    window.location.href = '/profile';
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-r from-[#f5f5dc] to-[#f2b6be] flex flex-col p-8 space-y-8">
        {/* Header Section */}
        <div className="w-full fixed top-0 left-0 right-0 bg-gradient-to-r from-[#f5f5dc] to-[#f2b6be] p-4 shadow-lg z-40">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            {/* Mobile Header Left */}
            <div className="lg:hidden flex items-center space-x-4">
              <button 
                id="hamburger-button"
                onClick={toggleSidebar} 
                className="text-gray-700 z-50"
              >
                {sidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold text-gray-900">ScentLabs</h1>
            </div>

            {/* Desktop Branding */}
            <div className="hidden lg:block text-left">
              <h1 className="text-3xl font-extrabold text-gray-900">ScentLabs</h1>
            </div>

            {/* Mobile Header Right */}
            <div className="lg:hidden flex items-center space-x-4">
              <FaUserAlt className="w-5 h-5 text-gray-700 cursor-pointer" onClick={navigateToProfile} />
              
              <button onClick={toggleSearchBar} className="text-lg text-gray-700">
                <FaSearch className="w-5 h-5" />
              </button>

              {/* Custom ConnectWallet Button for Mobile */}
              <CustomConnectWallet isMobile={true} />
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center space-x-6">
              <FaUserAlt className="w-5 h-5 text-gray-700 cursor-pointer" onClick={navigateToProfile} />
              <a href="#" className="text-lg text-gray-700">Collections</a>
              <a href="#" className="text-lg text-gray-700">Brands</a>
              <a href="#" className="text-lg text-gray-700">Create</a>
              
              <div className="relative">
                <button onClick={toggleDropdown} className="text-lg text-gray-700 flex items-center space-x-2">
                  <FaChevronDown className="w-4 h-4" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-2 mt-6 w-48 bg-[#f5f5dc] border border-pink-500 rounded-lg shadow-lg z-10">
                    <ul>
                      <li><a href="#" className="block px-4 py-2 text-gray-800 hover:bg-pink-100">Auction</a></li>
                      <li><a href="#" className="block px-4 py-2 text-gray-800 hover:bg-pink-100">Collections</a></li>
                      <li><a href="#" className="block px-4 py-2 text-gray-800 hover:bg-pink-100">Settings</a></li>
                      <li><a href="#" className="block px-4 py-2 text-gray-800 hover:bg-pink-100">Marketplace</a></li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative flex items-center space-x-2">
                <button onClick={toggleSearchBar} className="text-lg text-gray-700">
                  <FaSearch className="w-5 h-5" />
                </button>
                {searchVisible && (
                  <input
                    type="text"
                    className="mt-2 px-4 py-2 border border-pink-500 rounded-lg w-48 transition-all placeholder-black text-black"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                )}
              </div>

              {/* Custom ConnectWallet Button for Desktop */}
              <CustomConnectWallet isMobile={false} />
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchVisible && (
            <div className="lg:hidden mt-4 px-4">
              <input
                type="text"
                className="w-full px-4 py-2 text-black border border-pink-500 rounded-lg placeholder-black"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Improved Sidebar */}
        <motion.div
          id="mobile-sidebar"
          className={`fixed top-0 left-0 h-screen w-65 bg-[#f5f5dc] border-2 border-pink-500 z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          initial={false}
        >
          {/* Sidebar Header */}
          <div className="sticky top-0 bg-[#f5f5dc] p-4 border-b-2 border-pink-500">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="flex-1 p-4 space-y-2">
              <a href="#" className="block py-3 px-4 text-gray-700 hover:bg-pink-100 rounded-lg transition-colors">Collections</a>
              <a href="#" className="block py-3 px-4 text-gray-700 hover:bg-pink-100 rounded-lg transition-colors">Brands</a>
              <a href="#" className="block py-3 px-4 text-gray-700 hover:bg-pink-100 rounded-lg transition-colors">Create</a>
              <a href="#" className="block py-3 px-4 text-gray-700 hover:bg-pink-100 rounded-lg transition-colors">Auction</a>
              <a href="#" className="block py-3 px-4 text-gray-700 hover:bg-pink-100 rounded-lg transition-colors">Marketplace</a>
              <a href="#" className="block py-3 px-4 text-gray-700 hover:bg-pink-100 rounded-lg transition-colors">Settings</a>
            </nav>
            
            {/* Footer Section */}
            <div className="mt-auto p-4 border-t-2 border-pink-500">
              <p className="text-sm text-gray-600 text-center">© 2025 ScentLabs</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Collection Grid */}
        <motion.div
          className={`w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-24 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'
          }`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: sidebarOpen ? 0.5 : 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {["Collection 1", "Collection 2", "Collection 3", "Collection 4"].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/10 p-6 rounded-lg shadow-lg border border-pink-600 backdrop-blur-md transform transition duration-500 hover:scale-105 hover:shadow-pink-400/50"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-pink-500">{item}</h4>
              <p className="text-black mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div className="flex justify-between mt-4">
                <span className="text-sm text-gray-500">5 Scents</span>
                <span className="text-sm text-gray-500">Price: 1.2 ETH</span>
              </div>
              <button className="w-full mt-4 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600">View Collection</button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </WalletProvider>
  );
}

export default App;