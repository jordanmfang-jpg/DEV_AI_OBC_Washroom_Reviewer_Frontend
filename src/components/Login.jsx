// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { HiChartBar } from "react-icons/hi2";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',  // ✅ Use email field
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);  // ✅ Pass email
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-gray-800 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block text-7xl mb-4">🏛️</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Creating a more inclusive Ontario starts here
          </h1>
          <p className="text-primary-100">
            Ontario AODA Compliance Analyzer
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>

          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <span className="text-xl mr-2">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-500 hover:text-primary-600 font-semibold transition duration-200"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center text-white/80 text-sm">
          <div className="flex justify-center space-x-6">
            <span className="flex items-center space-x-1">
              <span>✅</span>
              <span>AI-Powered</span>
            </span>
            <span className="flex items-center space-x-1">
              <span><HiChartBar className="text-3xl text-blue-500" />
</span>
              <span>Accurate</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>⚡</span>
              <span>Fast</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;