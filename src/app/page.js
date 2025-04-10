"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const navigateToCollection = () => {
    router.push('/collection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f5f5dc] to-[#f2b6be] flex flex-col items-center p-4 md:p-12 space-y-8 md:space-y-16">
      {/* Hero Section */}
      <div className="flex flex-row items-center justify-between w-full max-w-6xl gap-4 md:gap-8">
        {/* Left Side - Text Content */}
        <div className="text-left w-3/5 md:w-full lg:max-w-lg">
          <h1 className="text-3xl md:text-6xl font-extrabold text-gray-900 mb-2 md:mb-4 font-serif transform transition-all duration-500 hover:scale-110 hover:text-pink-600">
            ScentLabs
          </h1>
          <p className="text-base md:text-xl text-gray-700 mb-2 md:mb-6">Bridge the Gap Between Digital and Real-World Scents.</p>
          <p className="text-xs md:text-md text-gray-500 mb-2 md:mb-6 hidden md:block">
            ScentLabs is a decentralized platform built on Starknet, bridging Web2 and Web3 scent creation. It's designed for creators, indie perfumers, and brands to craft, mint, and trade digital perfumes tied to real-world products.
          </p>
          <p className="text-xs md:text-md text-gray-500 mb-2 md:mb-6 hidden md:block">Empowering creators with a seamless, blockchain-backed experience for ownership, royalties, and collaboration.</p>
          
          <button 
            onClick={navigateToCollection}
            className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-pink-500 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-pink-600"
          >
            Start Creating
          </button>
        </div>

        {/* Right Side - Image */}
        <div className="w-2/5 md:w-full lg:max-w-md">
          <img 
            src="/undefined_image__5_-removebg-preview.png" 
            alt="Fragrance Image" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* How It Works Section */}
      <motion.div 
        className="w-full max-w-4xl px-2 md:px-4"
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
              description: "Start by connecting your wallet (Bravos or ArgentX) and choosing a username to begin your scent creation journey."
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