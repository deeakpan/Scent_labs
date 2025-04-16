"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import { FaSearch, FaUserAlt, FaChevronDown, FaBars, FaTimes, FaWallet, FaCheck, FaTimes as FaTimesCircle, FaExternalLinkAlt } from "react-icons/fa";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletProvider } from '../../../walletconnect';
import { useAccount } from 'wagmi';
import { checkUsernameExists, getUsernameByWallet, saveUsername, checkBaseNameForWallet } from '../../../supabase';

// Custom ConnectWallet component
const CustomConnectWallet = ({ isMobile, onConnect }) => {
  const { address, isConnected } = useAccount();
  const hasTriggeredConnect = useRef(false);
  
  useEffect(() => {
    // Only trigger onConnect once when wallet is first connected
    if (isConnected && address && !hasTriggeredConnect.current) {
      hasTriggeredConnect.current = true;
      onConnect(address);
    }
  }, [isConnected, address, onConnect]);

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

// Username Modal Component
const UsernameModal = ({ isOpen, onClose, walletAddress }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingData, setExistingData] = useState({ username: null, hasBaseName: false });
  const [baseName, setBaseName] = useState(null);
  const [useBaseName, setUseBaseName] = useState(false);
  const hasInitialized = useRef(false);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  useEffect(() => {
    const fetchData = async () => {
      if (walletAddress && isOpen && !hasInitialized.current) {
        hasInitialized.current = true;
        setIsLoading(true);
        
        try {
          // Check for existing username in our database
          const existingUserData = await getUsernameByWallet(walletAddress);
          setExistingData(existingUserData);
          
          if (existingUserData.username) {
            setUsername(existingUserData.username);
          }
          
          // Check for .base.eth name
          const detectedName = await checkBaseNameForWallet(walletAddress);
          if (detectedName) {
            setBaseName(detectedName);
            if (!existingUserData.username) {
              // Remove .base.eth suffix for username
              setUsername(detectedName.replace('.base.eth', ''));
              setUseBaseName(true);
            }
          }
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (isOpen && walletAddress) {
      fetchData();
    }
    
    // Reset state when modal closes
    if (!isOpen) {
      hasInitialized.current = false;
    }
  }, [walletAddress, isOpen]);

  const validateUsername = (value) => {
    if (!value || value.trim() === '') {
      return 'Username cannot be empty';
    }
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setError(validateUsername(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate username again
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if username exists (skip check if it's the user's existing username)
      if (username !== existingData.username) {
        const exists = await checkUsernameExists(username);
        if (exists) {
          setError('Username already taken');
          setIsLoading(false);
          return;
        }
      }
      
      // Save username
      const result = await saveUsername(username, walletAddress, useBaseName || existingData.hasBaseName);
      
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to save username');
      }
    } catch (err) {
      setError('An error occurred, please try again');
      console.error("Submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const goToBaseNameService = () => {
    window.open('https://www.base.org/manage-names', '_blank');
  };
  
  // If not open, return null
  if (!isOpen) return null;

  const handleModalClick = (e) => {
    // Prevent clicks inside the modal from closing it
    e.stopPropagation();  
  };

  const handleCloseButtonClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className={`bg-[#f5f5dc] p-4 md:p-6 rounded-lg shadow-lg border-2 border-pink-500 w-full ${isMobile ? 'max-w-[90%] mx-4' : 'max-w-md'} relative`}
        onClick={handleModalClick}
      >
        <button 
          onClick={handleCloseButtonClick}
          className="absolute top-3 md:top-4 right-3 md:right-4 text-gray-700 hover:text-pink-500"
          aria-label="Close modal"
        >
          <FaTimesCircle size={isMobile ? 16 : 20} />
        </button>
        
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-pink-500 text-center mb-4 md:mb-6`}>
          {existingData.username ? 'Update Your Username' : 'Create Username'}
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-6 md:py-8">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : isSuccess ? (
          <div className="text-center py-6 md:py-8">
            <div className="mb-4 flex justify-center">
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheck className="text-green-500 text-2xl" />
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
              className="py-3 px-4 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg shadow-lg mb-4"
            >
              <p className="text-lg md:text-xl font-bold text-white break-all overflow-hidden">
                @{username}
              </p>
            </motion.div>
            <p className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-gray-800`}>
              {existingData.username ? 'Username updated successfully!' : 'Username created successfully!'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {baseName && !existingData.hasBaseName && (
              <div className={`mb-4 md:mb-6 bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200 ${isMobile ? 'text-sm' : 'text-base'}`}>
                <p className="font-medium text-blue-700 mb-1 md:mb-2">
                  We found a .base.eth name for your wallet!
                </p>
                <p className="text-blue-600 mb-2 md:mb-3">
                  Would you like to use <span className="font-bold">{baseName.replace('.base.eth', '')}</span> as your username?
                </p>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useBaseName"
                    checked={useBaseName}
                    onChange={() => {
                      setUseBaseName(!useBaseName);
                      if (!useBaseName) {
                        setUsername(baseName.replace('.base.eth', ''));
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="useBaseName" className="text-blue-700">
                    Use my .base.eth name
                  </label>
                </div>
              </div>
            )}
            
            {!baseName && !existingData.hasBaseName && (
              <div className={`mb-4 md:mb-6 bg-yellow-50 p-3 md:p-4 rounded-lg border border-yellow-200 ${isMobile ? 'text-sm' : 'text-base'}`}>
                <p className="font-medium text-yellow-700 mb-1 md:mb-2">
                  No .base.eth name found for your wallet
                </p>
                <p className="text-yellow-600 mb-2 md:mb-3">
                  Would you like to create one? A .base.eth name gives you a unique on-chain identity across the Base ecosystem.
                </p>
                <button
                  type="button"
                  onClick={goToBaseNameService}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  Get a .base.eth name <FaExternalLinkAlt className="ml-1" size={isMobile ? 10 : 12} />
                </button>
              </div>
            )}
            
            <div className="mb-4 md:mb-6">
              <label htmlFor="username" className={`block text-black mb-1 md:mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                Choose a username
              </label>
              <input
                type="text"
                id="username"
                className={`w-full px-3 py-2 md:px-4 md:py-3 border-2 text-black ${error ? 'border-red-500' : 'border-pink-300'} rounded-lg focus:outline-none focus:border-pink-500 ${isMobile ? 'text-sm' : 'text-base'}`}
                placeholder="Enter username"
                value={username}
                onChange={handleChange}
                minLength={3}
                required
              />
              {error && (
                <p className={`text-red-500 ${isMobile ? 'text-xs mt-1' : 'text-sm mt-1'}`}>{error}</p>
              )}
              <p className={`text-gray-500 ${isMobile ? 'text-xs mt-1' : 'text-sm mt-2'}`}>
                Username must be at least 3 characters and can only contain letters, numbers, and underscores.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 md:space-x-4">
              <button
                type="button"
                onClick={handleCloseButtonClick}
                className={`px-3 py-1 md:px-6 md:py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 ${isMobile ? 'text-sm' : 'text-base'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!!error || !username || isLoading}
                className={`px-3 py-1 md:px-6 md:py-2 bg-pink-500 text-white rounded-lg ${isMobile ? 'text-sm' : 'text-base'} ${
                  (!!error || !username || isLoading) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-pink-600'
                }`}
              >
                {existingData.username ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const hasShownModal = useRef(false);
  
  const handleWalletConnect = (address) => {
    setConnectedWallet(address);
    
    // Only show the modal once per session
    if (!hasShownModal.current) {
      // Check if user already has a username
      const checkExistingUsername = async () => {
        try {
          const userData = await getUsernameByWallet(address);
          if (!userData.username) {
            setShowUsernameModal(true);
            // Mark that we've shown the modal
            hasShownModal.current = true;
          }
        } catch (err) {
          console.error("Error checking username", err);
        }
      };
      
      checkExistingUsername();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const hamburgerBtn = document.getElementById('hamburger-button');
      
      if (sidebarOpen && sidebar && 
          !sidebar.contains(event.target) && 
          hamburgerBtn && 
          !hamburgerBtn.contains(event.target)) {
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

  // Optional: Add a manual way to open the username modal
  const openUsernameModal = () => {
    if (connectedWallet) {
      setShowUsernameModal(true);
    }
  };

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
              <CustomConnectWallet isMobile={true} onConnect={handleWalletConnect} />
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
              <CustomConnectWallet isMobile={false} onConnect={handleWalletConnect} />
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
        
        {/* Username Modal */}
        <UsernameModal 
          isOpen={showUsernameModal} 
          onClose={() => setShowUsernameModal(false)}
          walletAddress={connectedWallet}
        />
      </div>
    </WalletProvider>
  );
}

export default App;