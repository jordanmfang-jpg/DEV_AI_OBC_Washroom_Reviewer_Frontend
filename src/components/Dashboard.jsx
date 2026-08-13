// src/components/Dashboard.jsx - COMPLETE FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import api from './services/api';
import { XCircle, Target, Search, Folder, TrendingUp } from "lucide-react";
import { HiExclamationTriangle, HiCheckCircle, HiChartBar } from "react-icons/hi2";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ State for custom counts
  const [compliantCount, setCompliantCount] = useState(0);
  const [partialCount, setPartialCount] = useState(0);
  const [nonCompliantCount, setNonCompliantCount] = useState(0);

  const userData = Array.isArray(user) ? user[0] : user;

  const displayName = userData?.first_name 
    ? `${userData.first_name}`.trim()
    : userData?.email?.split('@')[0] || 'User';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, analysesData] = await Promise.all([
        api.getStatistics(),
        api.getAnalyses(),
      ]);
      
      console.log('📊 Analyses loaded:', analysesData);
      
      // ✅ Calculate counts from analysesData
      const compliant = analysesData.filter(a => {
        const status = a.compliance_status?.toLowerCase() || '';
        return status.includes('compliant') && !status.includes('partial');
      }).length;
      
      const partial = analysesData.filter(a => 
        a.compliance_status?.toLowerCase().includes('partial')
      ).length;
      
      const nonCompliant = analysesData.filter(a => {
        const status = a.compliance_status?.toLowerCase() || '';
        return status.includes('non') || 
               status === 'unknown' || 
               !a.compliance_status;
      }).length;
      
      // ✅ Set all state
      setStats(statsData);
      setRecentAnalyses(analysesData.slice(0, 5));
      setCompliantCount(compliant);
      setPartialCount(partial);
      setNonCompliantCount(nonCompliant);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceClasses = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('compliant') && !statusLower.includes('partial')) {
      return 'text-success-700 bg-success-50 border-success-200';
    }
    if (statusLower.includes('partial')) {
      return 'text-warning-700 bg-warning-50 border-warning-200';
    }
    if (statusLower.includes('non') || statusLower === 'unknown') {
      return 'text-danger-700 bg-danger-50 border-danger-200';
    }
    return 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('compliant') && !statusLower.includes('partial')) {
      return <HiCheckCircle className="w-5 h-5" />;
    }
    if (statusLower.includes('partial')) {
      return <HiExclamationTriangle className="w-5 h-5" />;
    }
    if (statusLower.includes('non') || statusLower === 'unknown') {
      return <XCircle className="w-5 h-5" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-700">
            Building a more accessible Ontario— one analysis at a time.
          </p>
          <p className="text-gray-600">
            Here's your washroom compliance overview.
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Analyses */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition duration-200 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Analyses</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total_analyses}</p>
                  </div>
                  <div className="bg-primary-100 rounded-full p-4">
                    <HiChartBar className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
              </div>

              {/* Compliant */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition duration-200 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Compliant</p>
                    <p className="text-3xl font-bold text-success-600">{compliantCount}</p>
                  </div>
                  <div className="bg-success-100 rounded-full p-4">
                    <HiCheckCircle className="w-8 h-8 text-success-600" />
                  </div>
                </div>
              </div>

              {/* Partial */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition duration-200 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Partial</p>
                    <p className="text-3xl font-bold text-warning-600">{partialCount}</p>
                  </div>
                  <div className="bg-warning-100 rounded-full p-4">
                    <HiExclamationTriangle className="w-8 h-8 text-warning-600" />
                  </div>
                </div>
              </div>

              {/* Non-Compliant */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition duration-200 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Non-Compliant</p>
                    <p className="text-3xl font-bold text-danger-600">{nonCompliantCount}</p>
                  </div>
                  <div className="bg-danger-100 rounded-full p-4">
                    <XCircle className="w-8 h-8 text-danger-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Average Score */}
            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-gray-800 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-300 text-sm font-medium mb-1">Average Compliance Score</p>
                  <p className="text-5xl font-bold">
                    {stats.average_compliance_score != null 
                      ? `${Math.round(stats.average_compliance_score)}%`
                      : 'N/A'}
                  </p>
                </div>
                <Target className="w-16 h-16 text-white/80" />
              </div>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.average_compliance_score || 0}%` }}
                ></div>
              </div>
              {stats.total_analyses > 0 && (
                <p className="text-gray-300 text-xs mt-3 text-center">
                  Based on {stats.total_analyses} {stats.total_analyses === 1 ? 'analysis' : 'analyses'}
                </p>
              )}
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* New Analysis */}
          <Link
            to="/analyze"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg group cursor-pointer"
          >
            <div className="mb-3 ">
              <Search className="w-12 h-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">New Analysis</h3>
            <p className="text-gray-600 text-sm">
              Upload a floor plan and analyze compliance
            </p>
          </Link>

          {/* View History */}
          <a
            href="#recent-analyses"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg group cursor-pointer"
          >
            <div className="mb-3">
              <Folder className="w-12 h-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">View History</h3>
            <p className="text-gray-600 text-sm">
              Browse all your past analyses below
            </p>
          </a>

          {/* Statistics */}
          <Link
            to="/statistics"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg group cursor-pointer"
          >
            <div className="mb-3">
              <TrendingUp className="w-12 h-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Statistics</h3>
            <p className="text-gray-600 text-sm">
              View detailed analytics and trends
            </p>
          </Link>
        </div>

        {/* Recent Analyses */}
        <div id="recent-analyses" className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Analyses</h2>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <HiChartBar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No analyses yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first analysis
              </p>
              <Link
                to="/analyze"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
              >
                <Search className="w-5 h-5" />
                <span>Create First Analysis</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  to={`/analysis/${analysis.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-slate-400 hover:shadow-md transition duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {analysis.annotated_image_url && (
                        <img
                          src={analysis.annotated_image_url}
                          alt={analysis.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {analysis.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getComplianceClasses(
                          analysis.compliance_status
                        )}`}
                      >
                        {getStatusIcon(analysis.compliance_status)}
                        <span>{analysis.compliance_status}</span>
                      </span>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {analysis.compliance_score}%
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
