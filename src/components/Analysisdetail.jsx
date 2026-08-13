// src/components/Analysis/AnalysisDetail.jsx - Tailwind Version
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from './services/api';
import { HiChartBar } from "react-icons/hi2";
import { Target } from "lucide-react";
import { Crosshair } from "lucide-react";


const AnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadAnalysis();
  }, [id]);

  const loadAnalysis = async () => {
    try {
      const data = await api.getAnalysis(id);
      setAnalysis(data);
    } catch (error) {
      console.error('Error loading analysis:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    setDeleting(true);
    try {
      
      await api.deleteAnalysis(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting:', error);
      setDeleting(false);
      // ✅ Show error to user
      alert(`Failed to delete: ${error.message}`);
    }
  };

  const getComplianceClasses = (status) => {
    switch (status) {
      case 'compliant':
        return 'text-success-700 bg-success-50 border-success-200';
      case 'partial':
        return 'text-warning-700 bg-warning-50 border-warning-200';
      case 'non_compliant':
        return 'text-danger-700 bg-danger-50 border-danger-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return '✅';
      case 'partial': return '⚠️';
      case 'non_compliant': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis not found</h2>
          <Link
            to="/dashboard"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4 transition duration-200"
          >
            <span className="mr-2">←</span>
            Back to History
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {analysis.name || 'Untitled Analysis'}
              </h1>
              <p className="text-gray-600">
                Created {new Date(analysis.created_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-danger-500 hover:bg-danger-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2"
            >
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this analysis? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-danger-500 hover:bg-danger-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Status</p>
                <p className={`text-2xl font-bold ${
                  analysis.compliance_status === 'compliant' ? 'text-success-600' :
                  analysis.compliance_status === 'partial' ? 'text-warning-600' :
                  'text-danger-600'
                }`}>
                  {analysis.compliance_status.replace('_', ' ').toUpperCase()}
                </p>
              </div>
              <div className="text-4xl">
                {getStatusIcon(analysis.compliance_status)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Compliance Score</p>
                <p className="text-3xl font-bold text-gray-900">{analysis.compliance_score}%</p>
              </div>
              <div className="bg-primary-100 rounded-full p-4">
                <span className="text-3xl"><HiChartBar className="text-3xl text-blue-500" />
</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Objects Detected</p>
                <p className="text-3xl font-bold text-gray-900">{analysis.total_objects}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <span className="text-3xl"><Crosshair className="w-10 h-10 text-red-500" /></span>
                
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-md p-6 ${
            analysis.critical_issues_count > 0 ? 'border-danger-500' : 'border-success-500'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Critical Issues</p>
                <p className={`text-3xl font-bold ${
                  analysis.critical_issues_count > 0 ? 'text-danger-600' : 'text-success-600'
                }`}>
                  {analysis.critical_issues_count}
                </p>
              </div>
              <div className={`${
                analysis.critical_issues_count > 0 ? 'bg-danger-100' : 'bg-success-100'
              } rounded-full p-4`}>
                <span className="text-3xl">
                  {analysis.critical_issues_count > 0 ? '⚠️' : '✅'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Annotated Image from Backend */}
        {analysis.annotated_image_url && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎨</span>
              Floor Plan with Detected Fixtures
            </h2>
            <div className="text-center">
              {/* Backend returns an absolute URL -- don't prefix VITE_API_URL */}
              <img
                src={analysis.annotated_image_url}
                alt="Annotated floor plan"
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
              />
              <p className="text-sm text-gray-500 mt-4">
                ✨ Bounding boxes drawn by backend AI using Ultralytics Annotator
              </p>
            </div>
          </div>
        )}

        {/* Before & After Comparison */}
        {analysis.image_url && analysis.annotated_image_url && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📸</span>
              Before & After Comparison
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                  Original Image
                </h3>
                <img
                  src={analysis.image_url}
                  alt="Original"
                  className="w-full h-auto rounded-lg shadow-md border-2 border-gray-200"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                  Annotated Image
                </h3>
                <img
                  src={analysis.annotated_image_url}
                  alt="Annotated"
                  className="w-full h-auto rounded-lg shadow-md border-2 border-primary-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Detected Objects */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">📋</span>
            Detected Objects ({analysis.detected_objects?.length || 0})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.detected_objects?.map((obj, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 capitalize">
                    {obj.label.replace('_', ' ')}
                  </span>
                  <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded">
                    {(obj.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{obj.description}</p>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500 font-mono">
                    Box: [{obj.bounding_box.join(', ')}]
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Measurements */}
        {analysis.measurements?.fixture_measurements &&
         analysis.measurements.fixture_measurements.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📏</span>
              Fixture Measurements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.measurements.fixture_measurements.map((measurement, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-5 hover:border-primary-300 hover:shadow-md transition duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                    {measurement.label.replace('_', ' ')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Dimensions:</span>
                      <span className="text-gray-900">
                        {measurement.dimensions.width_inches || 'N/A'}" × {' '}
                        {measurement.dimensions.depth_inches || 'N/A'}" × {' '}
                        {measurement.dimensions.height_inches || 'N/A'}"
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Position:</span>
                      <span className="text-gray-900">{measurement.position}</span>
                    </div>
                    {measurement.clear_space && (
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-gray-600 font-medium mb-2">Clear Space:</p>
                        <div className="text-sm space-y-1 ml-4">
                          <p className="text-gray-700">
                            Front: {measurement.clear_space.front_inches || 'N/A'}"
                          </p>
                          <p className="text-gray-700">
                            Sides: {measurement.clear_space.sides_inches || 'N/A'}"
                          </p>
                          <p className="text-gray-700">
                            Back: {measurement.clear_space.back_inches || 'N/A'}"
                          </p>
                        </div>
                      </div>
                    )}
                    {measurement.mounting_height_inches && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Mounting Height:</span>
                        <span className="text-gray-900">{measurement.mounting_height_inches}"</span>
                      </div>
                    )}
                    {measurement.notes && (
                      <div className="bg-gray-50 rounded p-3 mt-3">
                        <p className="text-sm text-gray-700">{measurement.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Room Dimensions */}
        {analysis.measurements?.room_dimensions && (
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="mr-2">🏠</span>
              Room Dimensions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-primary-100 text-sm mb-1">Width</p>
                <p className="text-3xl font-bold">
                  {analysis.measurements.room_dimensions.estimated_width_feet} ft
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-primary-100 text-sm mb-1">Depth</p>
                <p className="text-3xl font-bold">
                  {analysis.measurements.room_dimensions.estimated_depth_feet} ft
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-primary-100 text-sm mb-1">Total Area</p>
                <p className="text-3xl font-bold">
                  {analysis.measurements.room_dimensions.estimated_area_sqft} ft²
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Checks */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">✅</span>
            Compliance Checks
          </h2>
          <div className="space-y-4">
            {analysis.compliance_checks?.map((check, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-5 ${
                  check.status === 'compliant'
                    ? 'border-success-200 bg-success-50'
                    : check.status === 'non_compliant'
                    ? 'border-danger-200 bg-danger-50'
                    : check.status === 'not_applicable'
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-warning-200 bg-warning-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">
                      {check.status === 'compliant' ? '✅' :
                       check.status === 'non_compliant' ? '❌' :
                       check.status === 'not_applicable' ? '➖' : '❓'}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">
                        {check.requirement}
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">{check.code_reference}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getComplianceClasses(
                      check.status
                    )}`}
                  >
                    {check.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{check.details}</p>

                {check.issues && check.issues.length > 0 && (
                  <div className="mb-4">
                    <p className="font-semibold text-danger-700 mb-2">⚠️ Issues Found:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      {check.issues.map((issue, i) => (
                        <li key={i} className="text-sm text-gray-700">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {check.recommendations && check.recommendations.length > 0 && (
                  <div>
                    <p className="font-semibold text-primary-700 mb-2">💡 Recommendations:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      {check.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-700">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/analyze"
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 text-center"
          >
            🔍 New Analysis
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 text-center"
          >
            📁 View History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AnalysisDetail;
