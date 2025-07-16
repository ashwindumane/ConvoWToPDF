import React from "react";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-100 py-3 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-gray-300 mb-2" />
        <div className="flex flex-col items-center">
          <h1 className="text-sm mb-2">
            Designed & developed by <span className="font-semibold">Ashwin Dumane</span>
          </h1>
          <div className="flex space-x-5 text-xl">
            <a
              href="https://www.linkedin.com/in/ashwindumane/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com/ashwin_kshatriya_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-pink-500 transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://github.com/ashwindumane"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-800 transition-colors duration-200"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
