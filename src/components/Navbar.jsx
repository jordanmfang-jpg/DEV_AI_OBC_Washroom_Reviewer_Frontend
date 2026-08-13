import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ontarioLogo from '../assets/ontario-logo.jpg';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔍 Debug - log user object
  useEffect(() => {
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userData = Array.isArray(user) ? user[0] : user;

  const displayName = userData?.first_name 
    ? `${userData.first_name} ${userData.last_name || ''}`.trim()
    : userData?.email?.split('@')[0] || 'User';

  return (
    // <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-gray-800 shadow-lg sticky top-0 z-50">
    <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-gray-800 shadow-lg sticky top-0 z-50 py-6 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="transform group-hover:scale-110 transition-transform duration-200">
              <img 
                src={ontarioLogo} 
                alt="Ontario Logo" 
                className="h-14 w-14 object-contain rounded-full"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              {/* <span className="text-4xl hidden">🏛️</span> */}
            </div>
            <div className="hidden sm:block">
              <span className="text-white text-xl font-bold">Ontario AODA</span>
              <span className="text-gray-300 text-sm block">Compliance Analyzer</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-200 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/analyze"
                className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-200 font-medium"
              >
                Analyze
              </Link>

              <Link
                to="/statistics"
                className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-200 font-medium"
              >
                Statistics
              </Link>
                            
              {/* User Menu */}
              <div className="flex items-center space-x-3 border-l border-white/20 pl-4 ml-4">
                <div className="text-right hidden lg:block">
                  <p className="text-white text-sm font-medium">
                    {displayName}
                  </p>
                  <p className="text-gray-300 text-xs">
                    {userData?.email || 'No email'}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:bg-white/10 p-2 rounded-lg"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      
      {user && mobileMenuOpen && (
        <div className="block md:hidden bg-slate-700 border-t border-white/10 animate-fade-in">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/dashboard"
              className="block text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/analyze"
              className="block text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Analyze
            </Link>

            <Link
                to="/statistics"
                className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-200 font-medium"
              >
                Statistics
              </Link>

            <div className="border-t border-white/10 pt-2 mt-2">
              <p className="text-white px-4 py-2 text-sm font-medium">{userData?.first_name}</p>
              <p className="text-gray-300 px-4 text-xs mb-2">{userData?.email || 'No email'}</p>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-white hover:bg-white/10 px-4 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

