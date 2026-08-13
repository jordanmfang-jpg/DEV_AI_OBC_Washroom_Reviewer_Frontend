// src/components/Analysis/AnalysisPage.jsx - Tailwind Version
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './services/api';
import { HiChartBar } from "react-icons/hi2";
import { Target } from "lucide-react";
import { Crosshair } from "lucide-react";

const AnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisName, setAnalysisName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showSaveOption, setShowSaveOption] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
    setResult(null);
    setShowSaveOption(false);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (saveToDatabase = false) => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const analysisResult = await api.uploadAndAnalyze(
        selectedFile,
        analysisName || 'Untitled Analysis'
      );

      setResult(analysisResult);
      
      if (saveToDatabase) {
        setShowSaveOption(false);
        setTimeout(() => {
          navigate(`/analysis/${analysisResult.id}`);
        }, 2000);
      } else {
        setShowSaveOption(true);
      }
    } catch (err) {
      setError(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveResult = async () => {
    if (!result) return;
    
    setSaving(true);
    setTimeout(() => {
      navigate(`/analysis/${result.id}`);
    }, 500);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setAnalysisName('');
    setResult(null);
    setError('');
    setShowSaveOption(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <span className="mr-2">🔍</span>
            Analyze Washroom Compliance
          </h1>
          <p className="text-gray-600">
            Upload a floor plan image to check Ontario Building Code compliance
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6 flex items-start animate-fade-in">
            <span className="text-xl mr-3">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Upload Section */}
        {!result && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-400 hover:bg-primary-50 transition duration-200 cursor-pointer mb-6"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
              ) : (
                <div>
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-gray-700 font-medium text-lg mb-2">
                    Click to upload floor plan
                  </p>
                  <p className="text-gray-500 text-sm">
                    PNG, JPG, WEBP (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* File Info */}
            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="font-medium text-gray-900 flex items-center">
                  <span className="mr-2">📄</span>
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {/* Analysis Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Name (Optional)
              </label>
              <input
                type="text"
                value={analysisName}
                onChange={(e) => setAnalysisName(e.target.value)}
                placeholder="e.g., Main Floor Washroom"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleAnalyze(true)}
                disabled={!selectedFile || analyzing}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {analyzing ? '🔄 Analyzing...' : '💾 Analyze & Save'}
              </button>

              <button
                onClick={() => handleAnalyze(false)}
                disabled={!selectedFile || analyzing}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {analyzing ? '🔄 Analyzing...' : '👁️ Real-time Analysis'}
              </button>

              {selectedFile && (
                <button
                  onClick={handleReset}
                  className="sm:w-auto bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4 text-sm">
              <p className="font-medium text-gray-900 mb-2">💡 Analysis Modes:</p>
              <div className="space-y-1 text-gray-700">
                <p>
                  <strong className="text-primary-700">💾 Analyze & Save:</strong> Saves to database and navigates to detail view
                </p>
                <p>
                  <strong className="text-gray-700">👁️ Real-time Analysis:</strong> View results immediately without saving
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Progress */}
        {analyzing && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center animate-fade-in">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🤖 AI Analysis in Progress</h3>
            <p className="text-gray-600 mb-8">Running multi-agent compliance check...</p>
            
            {/* Progress Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: '🔍', label: 'Detecting Fixtures' },
                { icon: '🎨', label: 'Annotating Image' },
                { icon: '📏', label: 'Measuring Dimensions' },
                { icon: '✅', label: 'Checking Compliance' },
                { icon: <HiChartBar className="text-3xl text-blue-500" />, label: 'Generating Report' },
              ].map((step, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <p className="text-sm font-medium text-gray-700">{step.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && !analyzing && (
          <div className="space-y-6 animate-fade-in">
            {/* Save Banner */}
            {showSaveOption && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-primary-700 font-medium flex items-center">
                  <span className="mr-2">✨</span>
                  Results displayed in real-time (not saved)
                </p>
                <button
                  onClick={handleSaveResult}
                  disabled={saving}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : '💾 Save to Database'}
                </button>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Status</p>
                    <p className={`text-xl font-bold ${
                      result.compliance_status === 'compliant' ? 'text-success-600' :
                      result.compliance_status === 'partial' ? 'text-warning-600' :
                      'text-danger-600'
                    }`}>
                      {result.compliance_status.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                  <div className="text-4xl">
                    {result.compliance_status === 'compliant' ? '✅' :
                     result.compliance_status === 'partial' ? '⚠️' : '❌'}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Score</p>
                    <p className="text-2xl font-bold text-gray-900">{result.compliance_score}%</p>
                  </div>
                  <div className="bg-primary-100 rounded-full p-3">
                    <span className="text-3xl"><HiChartBar className="text-3xl text-blue-500" />
</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Objects</p>
                    <p className="text-2xl font-bold text-gray-900">{result.total_objects}</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <span className="text-3xl"><Crosshair className="w-10 h-10 text-red-500" /></span>
                  </div>
                </div>
              </div>

              <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
                result.critical_issues_count > 0 ? 'border-danger-500' : 'border-success-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Issues</p>
                    <p className={`text-2xl font-bold ${
                      result.critical_issues_count > 0 ? 'text-danger-600' : 'text-success-600'
                    }`}>
                      {result.critical_issues_count}
                    </p>
                  </div>
                  <div className={`${
                    result.critical_issues_count > 0 ? 'bg-danger-100' : 'bg-success-100'
                  } rounded-full p-3`}>
                    <span className="text-3xl">
                      {result.critical_issues_count > 0 ? '⚠️' : '✅'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Annotated Image */}
            {result.annotated_image_url && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🎨</span>
                  Detected Fixtures with Bounding Boxes
                </h3>
                <div className="text-center">
                  <img
                    src={result.annotated_image_url}
                    alt="Annotated floor plan"
                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                  />
                  <p className="text-sm text-gray-500 mt-4">
                    ✨ Bounding boxes drawn by backend AI (Ultralytics Annotator)
                  </p>
                </div>
              </div>
            )}

            {/* Detected Objects */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Detected Objects ({result.detected_objects?.length || 0})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.detected_objects?.map((obj, index) => (
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
                    <p className="text-sm text-gray-600">{obj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Checks */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">✅</span>
                Compliance Checks
              </h3>
              <div className="space-y-4">
                {result.compliance_checks?.map((check, index) => (
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
                          <h4 className="font-bold text-gray-900 mb-1">{check.requirement}</h4>
                          <p className="text-sm text-gray-600 font-medium">{check.code_reference}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        check.status === 'compliant' ? 'bg-success-100 text-success-700' :
                        check.status === 'non_compliant' ? 'bg-danger-100 text-danger-700' :
                        check.status === 'not_applicable' ? 'bg-gray-100 text-gray-700' :
                        'bg-warning-100 text-warning-700'
                      }`}>
                        {check.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{check.details}</p>

                    {check.issues && check.issues.length > 0 && (
                      <div className="mb-4">
                        <p className="font-semibold text-danger-700 mb-2">⚠️ Issues:</p>
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
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                🔄 Analyze Another
              </button>
              {showSaveOption && (
                <button
                  onClick={handleSaveResult}
                  disabled={saving}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : '💾 Save Results'}
                </button>
              )}
              {!showSaveOption && (
                <button
                  onClick={() => navigate(`/analysis/${result.id}`)}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
                >
                  <HiChartBar className="text-3xl text-blue-500" />
 View Full Details
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisPage;
