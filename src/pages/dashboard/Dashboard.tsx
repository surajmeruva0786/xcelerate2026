import { useState, useEffect } from 'react';
import { AnalysisController } from '../../components/dashboard/AnalysisController';
import { ImageGallery } from '../../components/dashboard/ImageGallery';
import { LLMInsightPanel } from '../../components/dashboard/LLMInsightPanel';

export default function Dashboard() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load existing results from localStorage on mount
    const stored = localStorage.getItem('analysisResults');
    if (stored) {
      try {
        setAnalysisData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load stored analysis:', e);
      }
    }

    // Listen for new analysis results from other components
    const handleAnalysisComplete = (event: any) => {
      setAnalysisData(event.detail);
      setIsLoading(false);
    };

    window.addEventListener('analysisComplete', handleAnalysisComplete);
    return () => window.removeEventListener('analysisComplete', handleAnalysisComplete);
  }, []);

  const handleAnalysisStart = () => {
    setIsLoading(true);
  };

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
    setIsLoading(false);
  };

  const handleAnalysisError = (error: string) => {
    setIsLoading(false);
    console.error('Analysis error:', error);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Encroachment Detection Dashboard</h2>
        <p className="text-sm text-gray-600 mt-2">
          AI-powered satellite imagery analysis for industrial zone compliance monitoring
        </p>
      </div>

      {/* Analysis Controller */}
      <AnalysisController
        onAnalysisStart={handleAnalysisStart}
        onAnalysisComplete={handleAnalysisComplete}
        onAnalysisError={handleAnalysisError}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2"></div>
          </div>
          <p className="text-sm text-blue-700 mt-4">
            Analyzing satellite imagery, detecting encroachments, and generating AI insights...
          </p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisData && !isLoading && (
        <>
          {/* LLM Insights Panel */}
          <LLMInsightPanel
            insights={analysisData.dashboard_insights}
            groqAnalysis={analysisData.groq_analysis}
            zone={analysisData.zone}
          />

          {/* Image Gallery */}
          <ImageGallery
            images={analysisData.images}
            zone={analysisData.zone}
          />

          {/* Technical Metrics (Optional - from OpenCV) */}
          {analysisData.metrics && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Boundary Match</p>
                  <p className="text-2xl font-bold text-teal-700">
                    {analysisData.metrics?.match_percentage?.toFixed(1) || 'N/A'}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Encroachment Status</p>
                  <p className={`text-lg font-semibold truncate ${analysisData.groq_analysis?.encroachment_status?.toLowerCase().includes('detected') ||
                      analysisData.metrics?.status === 'Encroachment Detected'
                      ? 'text-red-600'
                      : 'text-gray-900'
                    }`} title={analysisData.groq_analysis?.encroachment_status || analysisData.metrics?.status}>
                    {analysisData.groq_analysis?.encroachment_status || analysisData.metrics?.status || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Est. Construction</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {analysisData.groq_analysis?.construction_percentage || 0}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Est. Vegetation</p>
                  <p className="text-2xl font-bold text-green-700">
                    {analysisData.groq_analysis?.vegetation_percentage || 0}%
                  </p>
                </div>
              </div>
              {analysisData.groq_analysis?.encroachment_status && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-1">AI Analysis Conclusion</p>
                  <p className="text-base font-medium text-gray-900">
                    {analysisData.groq_analysis.encroachment_status}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!analysisData && !isLoading && (
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg shadow-md p-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Analysis Dashboard</h3>
            <p className="text-gray-600 mb-6">
              Select an industrial zone above and click "Run Analysis" to start AI-powered encroachment detection.
              The system will analyze satellite imagery, detect boundary violations, and provide actionable insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-teal-700 font-semibold mb-2">1. Satellite Analysis</div>
                <p className="text-sm text-gray-600">Compare past and present imagery to detect changes</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-teal-700 font-semibold mb-2">2. AI Detection</div>
                <p className="text-sm text-gray-600">Advanced computer vision identifies boundary violations</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-teal-700 font-semibold mb-2">3. LLM Insights</div>
                <p className="text-sm text-gray-600">Generate comprehensive reports and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
