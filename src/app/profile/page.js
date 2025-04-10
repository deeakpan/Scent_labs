"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaWallet, FaPen } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { motion } from "framer-motion";

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f5f5dc] to-[#f2b6be] flex flex-col items-center justify-center p-8 relative">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-transparent">
        {/* Back Icon & Profile Title */}
        <div className="flex items-center space-x-2">
          <IoArrowBack className="w-6 h-6 text-[#4c2a2a] cursor-pointer" />
          <span className="text-2xl font-bold text-[#4c2a2a] font-serif">Profile</span>
        </div>
        
        {/* Top Right Buttons */}
        <div className="flex items-center space-x-1">
          {/* Connect Wallet */}
          <button className="flex items-center space-x-2 bg-pink-500 text-white px-1 py-1 rounded-lg shadow-md hover:bg-[#e14e53] transition">
            <FaWallet className="w-5 h-5" />
            <span className="text-sm font-medium">Connect Wallet</span>
          </button>

          {/* Edit Profile */}
          <button className="p-2 rounded-full hover:bg-[#e6bcbc] transition">
            <FaPen className="w-5 h-5 text-[#4c2a2a]" />
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <motion.div
        className="flex flex-col items-center space-y-4 mt-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Picture */}
        <motion.div
          className="w-40 h-40 rounded-full shadow-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/pepu2.jpg" alt="Profile" className="w-full h-full object-cover" />
        </motion.div>

        {/* Name & Verified Icon */}
        <div className="flex items-center space-x-2">
          <h2 className="text-4xl font-bold tracking-wide text-[#4c2a2a]">John Doe</h2>
          <MdVerified className="text-pink-500 w-6 h-6" />
        </div>

        {/* Username */}
        <div className="bg-pink-500 text-white text-lg px-4 py-1 rounded-full shadow-md">
          @johndoe_99
        </div>

        {/* Social Handles */}
        <div className="flex space-x-6">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            <FaXTwitter className="w-6 h-6 text-[#4c2a2a] hover:text-[#ff5a5f] transition-colors" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="w-6 h-6 text-[#4c2a2a] hover:text-[#ff5a5f] transition-colors" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="w-6 h-6 text-[#4c2a2a] hover:text-[#ff5a5f] transition-colors" />
          </a>
        </div>
      </motion.div>

      {/* Bio Section */}
      <div className="bg-white/40 text-[#5c3a3a] text-lg font-light px-6 py-3 rounded-lg shadow-md mt-4 max-w-lg text-center">
        Passionate about NFTs, the future of digital art, and exploring new technologies. Advocate for blockchain innovation and adoption.
      </div>

      {/* Stats Section */}
      <motion.div
        className="mt-6 flex justify-between w-full max-w-xs border-t border-[#e6bcbc] pt-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center flex-1">
          <span className="text-sm text-[#5c3a3a]">Total NFTs Owned</span>
          <h3 className="text-xl font-semibold text-[#4c2a2a]">5</h3>
        </div>
        <div className="text-center flex-1">
          <span className="text-sm text-[#5c3a3a]">Total Value</span>
          <h3 className="text-xl font-semibold text-[#4c2a2a]">6.5 ETH</h3>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
