import React from "react";

function Navbar() {
  return (
    <header className="w-full bg-white shadow-xl fixed top-0 z-50 h-[80px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold cursor-pointer hover:text-green-600 transition-colors duration-300">
          ConvoW<span className="text-green-500">To</span>PDF
        </h1>
        <nav>
          <a
            href="/"
            className="relative text-lg md:text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
          >
            Home
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
