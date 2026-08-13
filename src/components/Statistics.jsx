// src/components/Statistics.jsx - Calculate from analyses array
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import api from './services/api';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, CheckCircle2, XCircle, AlertTriangle, Search } from 'lucide-react';


var non_compliant_status = 0; // Declare variable to hold non-compliant count
var partial_status = 0; // Declare variable to hold partial count
var compliant_status = 0; // Declare variable to hold compliant count

function Statistics() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const analysesData = await api.getAnalyses();
     
    // ✅ Count compliant (has "compliant" but NOT "partial")
    compliant_status = analysesData.filter(a => {
      const status = a.compliance_status?.toLowerCase() || '';
      return status.includes('compliant') && !status.includes('partial');
    }).length;
    
    // ✅ Count partial (has "partial" anywhere)
    partial_status = analysesData.filter(a => 
      a.compliance_status?.toLowerCase().includes('partial')
    ).length;
    
    // ✅ Count non-compliant (has "non" OR is "unknown" OR is empty)
    non_compliant_status = analysesData.filter(a => {
      const status = a.compliance_status?.toLowerCase() || '';
      return status.includes('non') || 
             status === 'unknown' || 
             !a.compliance_status;
    }).length;
      
      setAnalyses(analysesData);
      
      // ✅ Calculate stats from analyses array directly
      const total = analysesData.length;
      
      // Convert status to lowercase for comparison (handles "Partial" vs "partial")
      const compliant = analysesData.filter(a => 
        a.compliance_status?.toLowerCase() === 'compliant'
      ).length;

      
      const partial = analysesData.filter(a => 
        a.compliance_status?.toLowerCase() === 'partial'
      ).length;

      
      const non_compliant = analysesData.filter(a => 
        a.compliance_status?.toLowerCase() === 'non_compliant' ||
        a.compliance_status?.toLowerCase() === 'non-compliant'
      ).length;
      
      // Calculate average score
      const scores = analysesData.map(a => a.compliance_score || 0);
      const avg_score = scores.length > 0 
        ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
        : 0;
      
      const calculatedStats = {
        total_analyses: total,
        compliant: compliant,
        partial: partial,
        non_compliant: non_compliant,
        average_compliance_score: avg_score
      };
            
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate compliance rate
  const complianceRate = stats && stats.total_analyses > 0
    ? ((stats.compliant / stats.total_analyses) * 100).toFixed(1)
    : 0;

  // Calculate trend
  const trend = complianceRate > 50 ? 'up' : 'down';

  // Group analyses by month
  const analysesByMonth = analyses.reduce((acc, analysis) => {
    const month = new Date(analysis.created_at).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  // Get average scores by status - case-insensitive
  const compliantAnalyses = analyses.filter(a => a.compliance_status?.toLowerCase() === 'compliant');
  const partialAnalyses = analyses.filter(a => a.compliance_status?.toLowerCase() === 'partial');
  const nonCompliantAnalyses = analyses.filter(a => 
    a.compliance_status?.toLowerCase() === 'non_compliant' ||
    a.compliance_status?.toLowerCase() === 'non-compliant'
  );

  const avgScoreByStatus = {
    compliant: compliantAnalyses.length > 0
      ? (compliantAnalyses.reduce((sum, a) => sum + (a.compliance_score || 0), 0) / compliantAnalyses.length).toFixed(1)
      : 0,
    partial: partialAnalyses.length > 0
      ? (partialAnalyses.reduce((sum, a) => sum + (a.compliance_score || 0), 0) / partialAnalyses.length).toFixed(1)
      : 0,
    non_compliant: nonCompliantAnalyses.length > 0
      ? (nonCompliantAnalyses.reduce((sum, a) => sum + (a.compliance_score || 0), 0) / nonCompliantAnalyses.length).toFixed(1)
      : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!stats || stats.total_analyses === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <BarChart3 className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Statistics Available Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first analysis to start seeing detailed statistics, trends, and insights about your compliance data.
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <Search className="w-5 h-5" />
              <span>Create First Analysis</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <TrendingUp className="w-10 h-10 mr-3 text-primary-500" />
            Detailed Statistics
          </h1>
          <p className="text-gray-600">
            CComprehensive analytics and trends for your accessibility assessments
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Analyses */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm font-medium">Total Analyses</p>
              <BarChart3 className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total_analyses}</p>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </div>

          {/* Compliance Rate */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm font-medium">Compliance Rate</p>
              <CheckCircle2 className="w-5 h-5 text-success-500" />
            </div>
            <p className="text-3xl font-bold text-success-600">{complianceRate}%</p>
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <>
                  <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                  <span className="text-sm text-success-600">Good compliance</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-danger-500 mr-1" />
                  <span className="text-sm text-danger-600">Needs attention</span>
                </>
              )}
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm font-medium">Avg. Score</p>
              <PieChart className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {stats.average_compliance_score ? stats.average_compliance_score.toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray-500 mt-2">Across all analyses</p>
          </div>

          {/* Issues Found */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm font-medium">Issues Found</p>
              <AlertTriangle className="w-5 h-5 text-warning-500" />
            </div>
            <p className="text-3xl font-bold text-warning-600">
              {(stats.partial || 0) + (stats.non_compliant || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Requiring attention</p>
          </div>
        </div>

        {/* Compliance Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Breakdown */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <PieChart className="w-6 h-6 mr-2 text-primary-500" />
              Compliance Status Distribution
            </h2>
            
            <div className="space-y-4">
              {/* Compliant */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-success-600 mr-2" />
                    <span className="text-gray-700 font-medium">Compliant</span>
                  </div>
                  <span className="text-gray-900 font-bold">{compliant_status || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-success-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total_analyses > 0 ? (compliant_status / stats.total_analyses) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Avg Score: {avgScoreByStatus.compliant}%
                </p>
              </div>

                {/* Partial Compliance */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-warning-600 mr-2" />
                    <span className="text-gray-700 font-medium">Partial Compliance</span>
                  </div>
                  <span className="text-gray-900 font-bold">{partial_status || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-warning-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total_analyses > 0 ? (partial_status / stats.total_analyses) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Avg Score: {avgScoreByStatus.partial}%
                </p>
              </div>

              {/* Non-Compliant */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-danger-600 mr-2" />
                    <span className="text-gray-700 font-medium">Non-Compliant</span>
                  </div>
                  <span className="text-gray-900 font-bold">{non_compliant_status || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-danger-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total_analyses > 0 ? (non_compliant_status / stats.total_analyses) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Avg Score: {avgScoreByStatus.non_compliant}%
                </p>
              </div>

            </div>
          </div>

          {/* Analyses Over Time */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-primary-500" />
              Analyses Over Time
            </h2>
            
            {Object.keys(analysesByMonth).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(analysesByMonth)
                  .sort(([a], [b]) => new Date(a) - new Date(b))
                  .slice(-6)
                  .map(([month, count]) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-gray-700 w-24">{month}</span>
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(count / Math.max(...Object.values(analysesByMonth))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-900 font-semibold w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Create more analyses to see timeline trends
              </p>
            )}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-gray-800 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4"><span><BarChart3 className="w-5 h-5 text-primary-500" /> </span>Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-300 text-sm mb-1">Most Common Status</p>
              <p className="text-2xl font-bold">
                {stats.compliant >= stats.partial && stats.compliant >= stats.non_compliant
                  ? '✅ Compliant'
                  : stats.partial >= stats.non_compliant
                  ? '⚠️ Partial'
                  : '❌ Non-Compliant'}
              </p>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-1">Total Analyzed</p>
              <p className="text-2xl font-bold">{stats.total_analyses} {stats.total_analyses === 1 ? 'Diagram' : 'Diagrams'}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-1">Compliance Rate</p>
              <p className="text-2xl font-bold">{complianceRate}%</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          {analyses.length > 0 ? (
            <div className="space-y-3">
              {analyses.slice(0, 5).map((analysis) => (
                <Link
                  key={analysis.id}
                  to={`/analysis/${analysis.id}`}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 hover:bg-gray-50 px-2 py-1 rounded transition duration-150"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{analysis.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{analysis.compliance_score}%</p>
                    <span className={`text-sm ${
                      analysis.compliance_status?.toLowerCase() === 'compliant' ? 'text-success-600' :
                      analysis.compliance_status?.toLowerCase() === 'partial' ? 'text-warning-600' :
                      'text-danger-600'
                    }`}>
                      {analysis.compliance_status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No analyses yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
