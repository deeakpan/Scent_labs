"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigateToCollection = () => {
    router.push('/collection');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Custom icon components
  const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12"></line>
      <line x1="4" x2="20" y1="6" y2="6"></line>
      <line x1="4" x2="20" y1="18" y2="18"></line>
    </svg>
  );

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f5f5dc] to-[#f2b6be] flex flex-col items-center p-0 md:p-12 space-y-4 md:space-y-16 relative">
      {/* Mobile Navigation that scrolls with content */}
      <div className="w-full flex justify-between items-center p-4 md:hidden">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src="/undefined_image__5_-removebg-preview.png" 
            alt="ScentLabs Logo" 
            className="h-10 w-auto mr-2 drop-shadow-md"
          />
          <span className="text-gray-800 font-bold text-lg drop-shadow-sm">ScentLabs</span>
        </motion.div>
        <motion.button 
          onClick={toggleMenu} 
          className="text-gray-800 p-2 rounded-full hover:bg-black/10 focus:outline-none transition-all duration-300 drop-shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </motion.button>
      </div>

      {/* Centered Cream-colored Menu with Black Border - Only visible when toggled */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed top-20 inset-x-0 z-20 md:hidden flex justify-center"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-[#f5f5dc] rounded-2xl shadow-xl border-2 border-black overflow-hidden w-4/5 max-w-sm">
              <div className="p-2">
                {[
                  { name: "Resources", icon: "📚" },
                  { name: "FAQ", icon: "❓" },
                  { name: "About", icon: "ℹ️" },
                  { name: "Contact", icon: "📧" }
                ].map((item, index) => (
                  <motion.a 
                    key={index} 
                    href="#" 
                    className="flex items-center space-x-3 p-3 text-gray-800 hover:bg-[#f2e8c6] rounded-xl transition-all duration-200 my-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, x: 5 }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </motion.a>
                ))}
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 text-white text-center">
                <motion.button 
                  onClick={navigateToCollection}
                  className="font-semibold text-base transition-all duration-300 hover:text-white/80"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Launch App ✨
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Overlay when menu is open */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleMenu}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with aligned brand elements */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-6 md:gap-8 px-4 md:px-0">
        {/* Text Content */}
        <div className="text-center md:text-left w-full md:w-3/5 lg:max-w-lg">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <img 
              src="/undefined_image__5_-removebg-preview.png" 
              alt="ScentLabs Logo" 
              className="hidden md:block h-16 w-auto mr-3"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 font-serif transform transition-all duration-500 hover:scale-110 hover:text-pink-600">
              ScentLabs
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 mb-4 md:mb-6">Bridge the Gap Between Digital and Real-World Scents.</p>
          <p className="text-sm md:text-md text-gray-600 mb-4 md:mb-6">
            A decentralized platform on Base Layer2 where creators, indie perfumers, and brands craft, mint, and trade digital perfumes tied to real-world products.
          </p>
          <p className="text-sm md:text-md text-gray-600 mb-5 md:mb-6">Seamless blockchain-backed experience for ownership, royalties, and collaboration.</p>
          
          <button 
            onClick={navigateToCollection}
            className="w-3/4 mx-auto md:w-auto px-5 md:px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-base font-semibold rounded-lg hover:from-pink-600 hover:to-pink-700 shadow-md"
          >
            Start Creating
          </button>
        </div>

        {/* Image - Only visible on desktop */}
        <div className="hidden md:block w-2/5 lg:max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-200 rounded-full filter blur-xl opacity-50"></div>
            <img 
              src="/undefined_image__5_-removebg-preview.png" 
              alt="Fragrance Image" 
              className="relative w-full h-auto object-contain transform hover:scale-105 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <motion.div 
        className="w-full max-w-4xl px-4 mt-8 md:mt-0"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl md:text-3xl font-bold text-pink-500 text-left md:text-center mb-6">
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[ 
            {
              title: "Connect Wallet & Choose Username",
              description: "Start by connecting your wallet Metamask,Coinbase,etc and choosing a username to begin your scent creation journey."
            },
            {
              title: "Create Your Digital Scent",
              description: "Use our intuitive tools to mix unique fragrance notes and create your custom scent."
            },
            {
              title: "Mint and Store On-Chain",
              description: "Mint your scent as an NFT and store it on the blockchain for secure ownership."
            },
            {
              title: "Trade & License in Marketplace",
              description: "List your scent NFTs to trade, sell, or license them to brands for real-world production."
            },
            {
              title: "Fuse Scents & Innovate",
              description: "Combine different digital scents to create new, unique blends and earn royalties."
            },
            {
              title: "Earn Royalties & Monetize",
              description: "Earn royalties on every trade, license, or fusion of your digital scent NFTs."
            }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg border border-pink-600 backdrop-blur-md transform transition duration-500 hover:scale-105 hover:shadow-pink-400/50"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-base md:text-lg font-semibold text-pink-500">{item.title}</h4>
              <p className="text-sm md:text-base text-black mt-1">{item.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#" className="text-pink-500 underline">Learn More</a>
        </div>
      </motion.div>
    </div>
  );
}