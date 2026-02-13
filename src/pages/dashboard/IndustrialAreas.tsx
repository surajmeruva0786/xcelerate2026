import { useState } from 'react';
import { Search, Filter, Eye, MapPin, TrendingUp, AlertCircle } from 'lucide-react';

const areasData = [
  {
    id: 1,
    name: 'Raipur Industrial Zone',
    totalPlots: 347,
    lastAnalysis: '2026-02-10',
    highRisk: 8,
    mediumRisk: 45,
    lowRisk: 294,
  },
  {
    id: 2,
    name: 'Bhilai Industrial Zone',
    totalPlots: 289,
    lastAnalysis: '2026-02-09',
    highRisk: 5,
    mediumRisk: 38,
    lowRisk: 246,
  },
  {
    id: 3,
    name: 'Durg Industrial Zone',
    totalPlots: 234,
    lastAnalysis: '2026-02-11',
    highRisk: 6,
    mediumRisk: 32,
    lowRisk: 196,
  },
  {
    id: 4,
    name: 'Rajnandgaon Industrial Area',
    totalPlots: 178,
    lastAnalysis: '2026-02-08',
    highRisk: 2,
    mediumRisk: 25,
    lowRisk: 151,
  },
  {
    id: 5,
    name: 'Korba Industrial Complex',
    totalPlots: 199,
    lastAnalysis: '2026-02-12',
    highRisk: 2,
    mediumRisk: 18,
    lowRisk: 179,
  },
];

export default function IndustrialAreas() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAreas = areasData.filter((area) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Industrial Areas</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage industrial zones</p>
        </div>
        <button className="px-4 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Add New Area
        </button>
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
              <p className="text-2xl font-bold text-gray-900">1,247</p>
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
              <p className="text-2xl font-bold text-gray-900">158</p>
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
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
      </div>

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
              {filteredAreas.map((area) => (
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
                    <p className="text-xs text-gray-500">3 days ago</p>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredAreas.length} of {areasData.length} areas
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Previous</button>
            <button className="px-3 py-1 bg-teal-700 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
