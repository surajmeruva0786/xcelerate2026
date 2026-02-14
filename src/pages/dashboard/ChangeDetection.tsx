import { useState, useEffect } from 'react';
import { ArrowLeftRight, Download, TrendingUp, AlertCircle, Layers, Calendar, History, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

export default function ChangeDetection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load existing results from localStorage
    const stored = localStorage.getItem('analysisResults');
    if (stored) {
      setAnalysisResults(JSON.parse(stored));
    }

    // Listen for new analysis results
    const handleAnalysisComplete = (event: any) => {
      setAnalysisResults(event.detail);
    };

    window.addEventListener('analysisComplete', handleAnalysisComplete);
    return () => window.removeEventListener('analysisComplete', handleAnalysisComplete);
  }, []);

  const changesData = analysisResults?.dashboard_insights?.change_detection || [];

  // Get before/after images
  const getBeforeImage = () => {
    if (analysisResults?.images?.satellite_past) return `${API_URL}/api/images/${analysisResults.images.satellite_past}`;
    return "https://images.unsplash.com/photo-1546833998-07256bcc76ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFwJTIwZ2Vvc3BhdGlhbCUyMEluZGlhJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzA5MTg3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
  };

  const getAfterImage = () => {
    if (analysisResults?.images?.satellite_present) return `${API_URL}/api/images/${analysisResults.images.satellite_present}`;
    return "https://images.unsplash.com/photo-1546833998-07256bcc76ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFwJTIwZ2Vvc3BhdGlhbCUyMEluZGlhJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzA5MTg3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
  };

  const filteredChanges = changesData.filter((item: any) =>
    (item.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.changeType || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    if (!changesData.length) return;
    const headers = ['Location', 'Change Type', 'Impact', 'Area Change', 'Confidence'];
    const rows = changesData.map((c: any) => [
      `"${c.location}"`, `"${c.changeType}"`, c.impact, c.areaChange, c.confidence
    ]);
    const csvContent = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'change_detection_log.csv';
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Change Detection Analysis</h2>
          <p className="text-sm text-gray-600 mt-1">Temporal analysis of built-up area changes</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Change Summary
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Total Changes</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{changesData.length}</p>
          <p className="text-xs text-gray-500 mt-1">detected anomalies</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Growth Detected</p>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {changesData.filter((c: any) => (c.changeType || '').includes('Construction') || (c.changeType || '').includes('Increase')).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">new constructions</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">High Impact</p>
          </div>
          <p className="text-2xl font-bold text-orange-900">
            {changesData.filter((c: any) => c.impact === 'High').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">require review</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <History className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Comparison Period</p>
          </div>
          <p className="text-lg font-bold text-gray-900">Past vs Present</p>
          <p className="text-xs text-gray-500 mt-1">Satellite Imagery</p>
        </div>
      </div>

      {/* AI Recommendations */}
      {analysisResults?.dashboard_insights?.page_recommendations?.change_detection?.length > 0 && (
        <div className="bg-teal-50 border border-teal-100 rounded-lg p-5">
          <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            AI Recommendations (Change Monitoring)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysisResults.dashboard_insights.page_recommendations.change_detection.map((rec: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-teal-900 bg-white/50 p-2 rounded">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Before/After Comparison */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Satellite Imagery Comparison</h3>

        <div className="relative bg-gray-100 rounded-lg overflow-hidden select-none" style={{ width: '100%', height: '500px' }}>
          {/* T1 Image (Before) */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={getBeforeImage()}
              alt="Past Satellite Imagery"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-900">Past (Satellite)</p>
            </div>
          </div>

          {/* T2 Image (After) - Clipped */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 ${100 - sliderPosition}% 0)` }}
          >
            <ImageWithFallback
              src={getAfterImage()}
              alt="Present Satellite Imagery"
              className="w-full h-full object-cover brightness-110"
            />
            <div className="absolute top-4 right-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-900">Present (Satellite)</p>
            </div>
          </div>

          {/* Slider Handle - Horizontal Bar */}
          <div
            className="absolute left-0 right-0 h-1 bg-white shadow-lg cursor-ns-resize z-10"
            style={{ top: `${sliderPosition}%` }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center rotate-90">
              <ArrowLeftRight className="w-5 h-5 text-gray-700" />
            </div>
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-20"
            style={{ writingMode: 'bt-lr', appearance: 'slider-vertical', WebkitAppearance: 'slider-vertical' }}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => setSliderPosition(0)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Show Past Only
          </button>
          <button
            onClick={() => setSliderPosition(50)}
            className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 text-sm"
          >
            50/50 Split
          </button>
          <button
            onClick={() => setSliderPosition(100)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Show Present Only
          </button>
        </div>
      </div>

      {/* Changes List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900">Detailed Change Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Detected changes in land use and structures</p>
          </div>
          {/* Simple Search */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search changes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Location</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Change Type</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Area Change</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Impact</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredChanges.length > 0 ? (
                filteredChanges.map((change: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" title={change.location}>{change.location}</td>
                    <td className="px-6 py-4 text-gray-700">{change.changeType}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{change.areaChange || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${change.impact === 'High' ? 'bg-red-100 text-red-700' :
                        change.impact === 'Medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                        {change.impact}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {change.confidence || 'High'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No changes to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}