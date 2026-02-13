import { useState } from 'react';
import { Search, Filter, Download, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const plotsData = [
  {
    plotId: 'IND-1234',
    industryName: 'Steel Manufacturing Ltd.',
    approvedArea: 5000,
    builtUpArea: 4200,
    vacantPercent: 16,
    encroachmentArea: 150,
    riskScore: 78,
    riskLevel: 'High',
    verificationStatus: 'Pending',
  },
  {
    plotId: 'IND-5678',
    industryName: 'Textile Industries Pvt. Ltd.',
    approvedArea: 3500,
    builtUpArea: 2800,
    vacantPercent: 20,
    encroachmentArea: 0,
    riskScore: 45,
    riskLevel: 'Medium',
    verificationStatus: 'Verified',
  },
  {
    plotId: 'IND-9012',
    industryName: 'Chemical Processing Co.',
    approvedArea: 4200,
    builtUpArea: 3900,
    vacantPercent: 7,
    encroachmentArea: 80,
    riskScore: 62,
    riskLevel: 'Medium',
    verificationStatus: 'Under Review',
  },
  {
    plotId: 'IND-3456',
    industryName: 'Automotive Parts Manufacturing',
    approvedArea: 6000,
    builtUpArea: 1200,
    vacantPercent: 80,
    encroachmentArea: 0,
    riskScore: 35,
    riskLevel: 'Low',
    verificationStatus: 'Verified',
  },
  {
    plotId: 'IND-7890',
    industryName: 'Electronics Assembly Unit',
    approvedArea: 2500,
    builtUpArea: 2650,
    vacantPercent: 0,
    encroachmentArea: 150,
    riskScore: 85,
    riskLevel: 'High',
    verificationStatus: 'Pending',
  },
];

export default function PlotCompliance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');

  const filteredPlots = plotsData.filter((plot) => {
    const matchesSearch =
      plot.plotId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.industryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'All' || plot.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (level: string) => {
    const colors = {
      High: 'bg-red-50 text-red-700 border-red-200',
      Medium: 'bg-orange-50 text-orange-700 border-orange-200',
      Low: 'bg-green-50 text-green-700 border-green-200',
    };
    return colors[level as keyof typeof colors];
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plot Compliance</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor individual plot compliance status</p>
        </div>
        <button className="px-4 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Total Plots</p>
          <p className="text-2xl font-bold text-gray-900">1,247</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">High Risk</p>
          <p className="text-2xl font-bold text-red-600">23</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Medium Risk</p>
          <p className="text-2xl font-bold text-orange-600">348</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Low Risk</p>
          <p className="text-2xl font-bold text-green-600">876</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Pending Verification</p>
          <p className="text-2xl font-bold text-blue-600">47</p>
        </div>
      </div>

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
              {filteredPlots.map((plot, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{plot.plotId}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{plot.industryName}</td>
                  <td className="px-4 py-3 text-gray-700">{plot.approvedArea.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-700">{plot.builtUpArea.toLocaleString()}</td>
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
                          className={`h-2 rounded-full ${
                            plot.riskScore >= 70
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredPlots.length} of {plotsData.length} plots
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Previous</button>
            <button className="px-3 py-1 bg-teal-700 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
