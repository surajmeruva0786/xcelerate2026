import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function PlotCompliance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('analysisResults');
    if (stored) {
      setAnalysisResults(JSON.parse(stored));
    }

    const handleAnalysisComplete = (event: any) => {
      setAnalysisResults(event.detail);
    };

    window.addEventListener('analysisComplete', handleAnalysisComplete);
    return () => window.removeEventListener('analysisComplete', handleAnalysisComplete);
  }, []);

  const plotsData = analysisResults?.dashboard_insights?.plot_compliance || [];

  const filteredPlots = plotsData.filter((plot: any) => {
    const matchesSearch =
      (plot.plotId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plot.industryName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'All' || plot.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (level: string) => {
    const colors: any = {
      High: 'bg-red-50 text-red-700 border-red-200',
      Medium: 'bg-orange-50 text-orange-700 border-orange-200',
      Low: 'bg-green-50 text-green-700 border-green-200',
    };
    return colors[level] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'Under Review':
        return <XCircle className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  // Stats
  const totalPlots = plotsData.length;
  const highRisk = plotsData.filter((p: any) => p.riskLevel === 'High').length;
  const mediumRisk = plotsData.filter((p: any) => p.riskLevel === 'Medium').length;
  const lowRisk = plotsData.filter((p: any) => p.riskLevel === 'Low').length;
  const pending = plotsData.filter((p: any) => p.verificationStatus === 'Pending').length;

  const handleExport = () => {
    if (!plotsData.length) return;

    const headers = ['Plot ID', 'Industry Name', 'Approved Area', 'Built-Up Area', 'Vacant %', 'Encroachment Area', 'Risk Score', 'Risk Level', 'Status'];
    const rows = plotsData.map((plot: any) => [
      plot.plotId,
      `"${plot.industryName}"`,
      plot.approvedArea,
      plot.builtUpArea,
      plot.vacantPercent,
      plot.encroachmentArea,
      plot.riskScore,
      plot.riskLevel,
      plot.verificationStatus
    ]);

    const csvContent = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `plot_compliance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plot Compliance</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor individual plot compliance status</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Total Plots</p>
          <p className="text-2xl font-bold text-gray-900">{totalPlots}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">High Risk</p>
          <p className="text-2xl font-bold text-red-600">{highRisk}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Medium Risk</p>
          <p className="text-2xl font-bold text-orange-600">{mediumRisk}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Low Risk</p>
          <p className="text-2xl font-bold text-green-600">{lowRisk}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Pending Verification</p>
          <p className="text-2xl font-bold text-blue-600">{pending}</p>
        </div>
      </div>

      {/* AI Recommendations */}
      {analysisResults?.dashboard_insights?.page_recommendations?.plot_compliance?.length > 0 && (
        <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
          <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            AI Recommendations (Action Required)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysisResults.dashboard_insights.page_recommendations.plot_compliance.map((rec: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-teal-900 bg-white/50 p-2 rounded">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Plot ID or Industry Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
            />
          </div>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
          >
            <option>All Risk Levels</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">More Filters</span>
          </button>
        </div>
      </div>

      {/* Plots Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Plot ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Industry Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Approved Area (m²)</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Built-Up Area (m²)</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Vacant %</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Encroachment (m²)</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Risk Score</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Risk Level</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlots.length > 0 ? (
                filteredPlots.map((plot: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{plot.plotId}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{plot.industryName}</td>
                    <td className="px-4 py-3 text-gray-700">{plot.approvedArea?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700">{plot.builtUpArea?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`${plot.vacantPercent > 50 ? 'text-orange-600' : 'text-gray-700'}`}>
                        {plot.vacantPercent}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${plot.encroachmentArea > 0 ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                        {plot.encroachmentArea}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${plot.riskScore >= 70
                              ? 'bg-red-500'
                              : plot.riskScore >= 50
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                              }`}
                            style={{ width: `${plot.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{plot.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded border text-xs font-medium ${getRiskBadge(plot.riskLevel)}`}>
                        {plot.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(plot.verificationStatus)}
                        <span className="text-xs">{plot.verificationStatus}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1 px-3 py-1 text-teal-700 hover:bg-teal-50 rounded transition-colors font-medium">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                    No plot data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPlots.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredPlots.length} of {plotsData.length} plots
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
