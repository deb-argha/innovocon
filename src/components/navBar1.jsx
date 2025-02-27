import React from "react";
import { FaHome, FaInfoCircle, FaQuestion, FaUserShield } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-900 to-black p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold animate-pulse">Slum Connect</div>
        <div className="flex gap-6">
          <a href="#" className="flex items-center gap-2 hover:text-purple-300 transition-colors">
            <FaHome /> Home
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-purple-300 transition-colors">
            <FaInfoCircle /> About
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-purple-300 transition-colors">
            <FaQuestion /> Help
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-purple-300 transition-colors">
            <FaUserShield /> Support
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;