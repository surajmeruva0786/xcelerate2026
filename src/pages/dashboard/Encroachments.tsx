import { useState, useEffect, useRef } from 'react';
import { Layers, ZoomIn, ZoomOut, Maximize2, MapPin, AlertTriangle, Filter, Search, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

export default function Encroachments() {
  const [showApprovedLayout, setShowApprovedLayout] = useState(true);
  const [showBuiltUpMask, setShowBuiltUpMask] = useState(true);
  const [showEncroachments, setShowEncroachments] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState<any | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const imgRef = useRef<HTMLDivElement>(null);

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

  const encroachmentsData = analysisResults?.dashboard_insights?.encroachments || [];

  const filteredEncroachments = encroachmentsData.filter((item: any) => {
    const matchesSearch =
      (item.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.type || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || item.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  // Get the map image URL - prefer encroachment analysis, fallback to superimposed, then industrial area
  const getMapImageUrl = () => {
    const images = analysisResults?.images;
    if (images?.encroachment_analysis) return `${API_URL}/api/images/${images.encroachment_analysis}`;
    if (images?.superimposed) return `${API_URL}/api/images/${images.superimposed}`;
    if (images?.industrial_area) return `${API_URL}/api/images/${images.industrial_area}`;
    return "https://images.unsplash.com/photo-1546833998-07256bcc76ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFwJTIwZ2Vvc3BhdGlhbCUyMEluZGlhJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzA5MTg3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
  };

  const getSeverityColor = (severity: string) => {
    const colors: any = {
      Critical: 'bg-red-50 text-red-700 border-red-200',
      High: 'bg-orange-50 text-orange-700 border-orange-200',
      Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      Low: 'bg-green-50 text-green-700 border-green-200',
    };
    return colors[severity] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Stats
  const totalCases = encroachmentsData.length;
  const criticalCount = encroachmentsData.filter((e: any) => e.severity === 'Critical').length;
  const highCount = encroachmentsData.filter((e: any) => e.severity === 'High').length;

  // Recommendations
  const recommendations = analysisResults?.dashboard_insights?.page_recommendations?.encroachments || [];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Map Area - Main Content */}
        <div className="flex-1 relative bg-gray-100">
          {/* Map Container */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={getMapImageUrl()}
              alt="Encroachment Map"
              className="w-full h-full object-cover"
              key={analysisResults?.images?.encroachment_analysis || 'default'}
            />

            {/* Simulated Overlays */}
            {showEncroachments && encroachmentsData.length > 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-24 h-24 bg-red-500/20 border-2 border-red-600 rounded-full animate-pulse ring-4 ring-red-500/10"></div>
              </div>
            )}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200 transition-colors"><ZoomIn className="w-5 h-5 text-gray-700" /></button>
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200 transition-colors"><ZoomOut className="w-5 h-5 text-gray-700" /></button>
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200 transition-colors"><Maximize2 className="w-5 h-5 text-gray-700" /></button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200 z-10">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              Severity Legend
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-50 border border-red-200 rounded-full ring-2 ring-red-500/50"></div>
                <span className="text-xs font-medium text-gray-700">Critical Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded-full ring-2 ring-orange-500/50"></div>
                <span className="text-xs font-medium text-gray-700">High Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded-full ring-2 ring-yellow-500/50"></div>
                <span className="text-xs font-medium text-gray-700">Medium Severity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel - Right Side */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col z-20 shadow-xl">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Encroachments
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              {totalCases} detected cases requiring attention
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <div className="text-2xl font-bold text-red-700 leading-none">{criticalCount}</div>
                <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-1">Critical</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <div className="text-2xl font-bold text-orange-700 leading-none">{highCount}</div>
                <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mt-1">High Risk</div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          {recommendations.length > 0 && (
            <div className="p-4 bg-teal-50 border-b border-teal-100">
              <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
                AI Recommendations
              </h3>
              <ul className="space-y-2">
                {recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="text-xs text-teal-900 flex items-start gap-2 leading-relaxed">
                    <span className="mt-1 w-1 h-1 rounded-full bg-teal-400 flex-shrink-0"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filters */}
          <div className="p-4 border-b border-gray-100 space-y-3 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations or types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-500 transition-colors"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>

            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/30">
            {filteredEncroachments.length > 0 ? (
              filteredEncroachments.map((item: any, index: number) => (
                <div
                  key={index}
                  className={`group p-3 rounded-lg border transition-all duration-200 cursor-pointer ${selectedPlot?.location === item.location
                    ? 'bg-teal-50 border-teal-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-teal-200 hover:shadow-sm'
                    }`}
                  onClick={() => setSelectedPlot(item)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.type || 'Encroachment'}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getSeverityColor(item.severity)}`}>
                      {item.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-50/50">
                    <span className="text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                      Area: <span className="font-medium text-gray-900">{item.area}</span>
                    </span>
                    <span className="text-teal-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-gray-500">No encroachments found</p>
                <p className="text-xs">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
