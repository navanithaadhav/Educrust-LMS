import React from "react";

export default function ConnectUs() {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-10">
      {/* Connect with us CTA */}
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg px-6 py-10 flex flex-col items-center -mt-20 mb-12 relative z-20">
        <p className="text-lg md:text-xl text-gray-700 font-medium mb-2">
          Couldn't find what you looking?
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Connect with us Right Away.
        </h2>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
          Connect with Counsellor
        </button>
      </div>

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start px-6">
        {/* Logo and Social */}
        <div className="mb-8 md:mb-0 flex flex-col items-center md:items-start">
          <div className="flex items-center mb-3">
            <div className="bg-blue-500 rounded-full h-12 w-12 flex items-center justify-center mr-2">
              <span className="text-2xl font-bold">∞</span>
            </div>
            <span className="text-2xl font-semibold ml-2">pragra</span>
          </div>
          <p className="text-sm text-blue-200 mb-4">
            Upskilling today’s workforce since 2017
          </p>
          <div className="flex space-x-3">
            <span className="w-5 h-5 bg-white text-blue-900 flex items-center justify-center rounded-full">F</span>
            <span className="w-5 h-5 bg-white text-blue-900 flex items-center justify-center rounded-full">T</span>
            <span className="w-5 h-5 bg-white text-blue-900 flex items-center justify-center rounded-full">I</span>
            <span className="w-5 h-5 bg-white text-blue-900 flex items-center justify-center rounded-full">L</span>
          </div>
        </div>
        {/* Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
          <div>
            <ul className="space-y-2">
              <li className="font-semibold mb-1">How it works</li>
              <li>Programs</li>
              <li>Companies</li>
              <li>Instructor</li>
              <li>About</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li>Financial Aid</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
              <li>Career</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li className="font-semibold mb-1">Legal</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
