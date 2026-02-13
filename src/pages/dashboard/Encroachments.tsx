import { useState, useEffect } from 'react';
import { Layers, ZoomIn, ZoomOut, Maximize2, X, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

const encroachmentData = [
  { plotId: 'IND-1234', area: 150, severity: 'High', location: 'Raipur Zone A' },
  { plotId: 'IND-7890', area: 150, severity: 'High', location: 'Durg Zone B' },
  { plotId: 'IND-9012', area: 80, severity: 'Medium', location: 'Bhilai Zone C' },
  { plotId: 'IND-4567', area: 65, severity: 'Medium', location: 'Raipur Zone B' },
  { plotId: 'IND-2345', area: 45, severity: 'Low', location: 'Korba Zone A' },
  { plotId: 'IND-8901', area: 95, severity: 'Medium', location: 'Rajnandgaon Zone A' },
];

export default function Encroachments() {
  const [showApprovedLayout, setShowApprovedLayout] = useState(true);
  const [showBuiltUpMask, setShowBuiltUpMask] = useState(true);
  const [showEncroachments, setShowEncroachments] = useState(true);
  const [showRoadDeviation, setShowRoadDeviation] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

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

  // Get the map image URL - prefer superimposed, fallback to industrial area, then default
  const getMapImageUrl = () => {
    // Use superimposed image if available (result of ChatGPT superimposition)
    if (analysisResults?.images?.superimposed) {
      return `${API_URL}/api/images/${analysisResults.images.superimposed}`;
    }
    // Fallback to industrial area map from CSIDC
    if (analysisResults?.images?.industrial_area) {
      return `${API_URL}/api/images/${analysisResults.images.industrial_area}`;
    }
    // Default fallback image
    return "https://images.unsplash.com/photo-1546833998-07256bcc76ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFwJTIwZ2Vvc3BhdGlhbCUyMEluZGlhJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzA5MTg3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Map Area */}
      <div className="flex-1 relative bg-gray-100">
        {/* Map Container */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={getMapImageUrl()}
            alt="Encroachment Map"
            className="w-full h-full object-cover"
            key={analysisResults?.images?.industrial_area || 'default'}
          />

          {/* Map overlay with encroachment highlights */}
          {showEncroachments && (
            <>
              <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-red-500/40 border-2 border-red-600 rounded animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-orange-500/40 border-2 border-orange-600 rounded"></div>
              <div className="absolute bottom-1/3 left-1/2 w-16 h-16 bg-yellow-500/40 border-2 border-yellow-600 rounded"></div>
            </>
          )}
        </div>

        {/* Map Controls - Top Right */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <ZoomOut className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Layer Controls - Top Left */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 w-64">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Map Layers</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showApprovedLayout}
                onChange={(e) => setShowApprovedLayout(e.target.checked)}
                className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600"
              />
              <span className="text-sm text-gray-700">Approved Layout</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showBuiltUpMask}
                onChange={(e) => setShowBuiltUpMask(e.target.checked)}
                className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600"
              />
              <span className="text-sm text-gray-700">Built-up Mask</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showEncroachments}
                onChange={(e) => setShowEncroachments(e.target.checked)}
                className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600"
              />
              <span className="text-sm text-gray-700">Encroachment Polygons</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showRoadDeviation}
                onChange={(e) => setShowRoadDeviation(e.target.checked)}
                className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600"
              />
              <span className="text-sm text-gray-700">Road Deviation</span>
            </label>
          </div>
        </div>

        {/* Legend - Bottom Left */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Encroachment Severity</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 border-2 border-red-600 rounded"></div>
              <span className="text-xs text-gray-700">High (&gt;100 m²)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 border-2 border-orange-600 rounded"></div>
              <span className="text-xs text-gray-700">Medium (50-100 m²)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500 border-2 border-yellow-600 rounded"></div>
              <span className="text-xs text-gray-700">Low (&lt;50 m²)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Encroachment Details</h2>
            <p className="text-sm text-gray-600 mt-1">{encroachmentData.length} plots with encroachments detected</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <p className="text-xs text-red-700 mb-1">High Severity</p>
              <p className="text-xl font-bold text-red-900">2</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <p className="text-xs text-orange-700 mb-1">Medium Severity</p>
              <p className="text-xl font-bold text-orange-900">3</p>
            </div>
          </div>

          {/* Encroachment List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Affected Plots</h3>
            {encroachmentData.map((item, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPlot === item.plotId
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                onClick={() => setSelectedPlot(item.plotId)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <p className="font-medium text-gray-900">{item.plotId}</p>
                  </div>
                  <span className={`px-2 py-1 rounded border text-xs font-medium ${getSeverityColor(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="text-gray-500">Encroached Area:</span>{' '}
                    <span className="font-medium text-red-600">{item.area} m²</span>
                  </p>
                  <p className="text-gray-600">
                    <span className="text-gray-500">Location:</span> {item.location}
                  </p>
                </div>
                <button className="mt-3 w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-sm font-medium transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Export Button */}
          <button className="w-full py-3 border-2 border-teal-700 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors font-medium">
            Export Encroachment Report
          </button>
        </div>
      </div>
    </div>
  );
}
