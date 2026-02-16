import { useState, useEffect } from 'react';
import { Search, Filter, Eye, MapPin, TrendingUp, AlertCircle } from 'lucide-react';

export default function IndustrialAreas() {
  const [searchQuery, setSearchQuery] = useState('');
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

  // Use dynamic data if available, otherwise fallback to empty array
  const areasData = analysisResults?.dashboard_insights?.industrial_areas || [];

  const filteredAreas = areasData.filter((area: any) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total stats from data
  const totalPlots = areasData.reduce((acc: any, curr: any) => acc + (curr.totalPlots || 0), 0);
  const totalHighRisk = areasData.reduce((acc: any, curr: any) => acc + (curr.highRisk || 0), 0);
  const totalMediumRisk = areasData.reduce((acc: any, curr: any) => acc + (curr.mediumRisk || 0), 0);

  const handleExport = () => {
    if (!analysisResults) return;

    // Create CSV content
    const headers = ['ID', 'Name', 'Total Plots', 'Last Analysis', 'High Risk', 'Medium Risk', 'Low Risk'];
    const rows = areasData.map((area: any) => [
      area.id,
      `"${area.name}"`,
      area.totalPlots,
      area.lastAnalysis,
      area.highRisk,
      area.mediumRisk,
      area.lowRisk
    ]);

    const csvContent = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `industrial_areas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Industrial Areas</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage industrial zones</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700"
          >
            <TrendingUp className="w-4 h-4" />
            Export Data
          </button>
          <button className="px-4 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Add New Area
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Areas</p>
              <p className="text-2xl font-bold text-gray-900">{areasData.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Plots</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlots}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Medium Risk</p>
              <p className="text-2xl font-bold text-gray-900">{totalMediumRisk}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">{totalHighRisk}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {analysisResults?.dashboard_insights?.page_recommendations?.industrial_areas?.length > 0 && (
        <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
          <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            AI Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysisResults.dashboard_insights.page_recommendations.industrial_areas.map((rec: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-teal-900 bg-white/50 p-2 rounded">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search industrial areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Filters</span>
          </button>
        </div>
      </div>

      {/* Areas Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Area Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Plots</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Analysis</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Risk Summary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAreas.length > 0 ? (
                filteredAreas.map((area: any) => (
                  <tr key={area.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-teal-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{area.name}</p>
                          <p className="text-xs text-gray-500">ID: AREA-{area.id.toString().padStart(3, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{area.totalPlots}</p>
                      <p className="text-xs text-gray-500">plots</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{area.lastAnalysis}</p>
                      <p className="text-xs text-gray-500">Latest scan</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded border border-red-200">
                          High: {area.highRisk}
                        </span>
                        <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded border border-orange-200">
                          Med: {area.mediumRisk}
                        </span>
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200">
                          Low: {area.lowRisk}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-2 px-4 py-2 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors font-medium">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No industrial areas found. Run an analysis to populate data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAreas.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredAreas.length} of {areasData.length} areas
            </p>
            <div className="flex items-center gap-2">
              <button disabled className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 bg-teal-700 text-white rounded text-sm">1</button>
              <button disabled className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
