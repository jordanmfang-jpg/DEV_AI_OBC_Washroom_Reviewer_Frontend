// src/components/Footer.jsx - Cool Classic Gradient
import React from 'react';
import { Link } from 'react-router-dom';
import ontarioLogo from '../assets/ontario-logo.jpg';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-700 to-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-4xl">
                <img 
                    src={ontarioLogo} 
                    alt="Ontario Logo" 
                    className="h-14 w-14 object-contain rounded-full"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                    />
              </span>
              <h3 className="text-2xl font-bold">Ontario AODA Analyzer</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              AI-powered washroom accessibility compliance checker for Ontario Building Code. 
              Automated detection, measurement, and comprehensive compliance reporting.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition duration-200"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="mailto:info@example.com"
                className="text-gray-300 hover:text-white transition duration-200"
                aria-label="Email"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="text-gray-300 hover:text-white transition duration-200">
                  Analyze
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="#help" className="text-gray-300 hover:text-white transition duration-200">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.ontario.ca/laws/regulation/120332"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Ontario Building Code
                </a>
              </li>
              <li>
                <a
                  href="https://www.ontario.ca/page/accessibility-laws"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition duration-200"
                >
                  Accessibility Laws
                </a>
              </li>
              <li>
                <a href="#docs" className="text-gray-300 hover:text-white transition duration-200">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#api" className="text-gray-300 hover:text-white transition duration-200">
                  API Reference
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600/50 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-300 text-sm">
            © {currentYear} Ontario AODA Compliance Analyzer. All rights reserved.
          </div>
          
          {/* Tech Stack Badge */}
          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <span>Powered by</span>
            <span className="bg-white/10 px-3 py-1 rounded-full font-medium hover:bg-white/20 transition duration-200">
              YOLOv8
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full font-medium hover:bg-white/20 transition duration-200">
              LangGraph
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full font-medium hover:bg-white/20 transition duration-200">
              Django
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full font-medium hover:bg-white/20 transition duration-200">
              React
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center text-gray-400 text-xs">
          <p>
            This tool provides automated compliance checks for informational purposes only. 
            Always consult with certified professionals for final compliance verification.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
