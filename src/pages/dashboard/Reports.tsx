import { useState } from 'react';
import { FileText, Download, Eye, Plus, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const reportsData = [
  {
    reportId: 'RPT-2026-012',
    area: 'Raipur Industrial Zone',
    date: '2026-02-10',
    status: 'Completed',
    type: 'Monthly Compliance',
  },
  {
    reportId: 'RPT-2026-011',
    area: 'Bhilai Industrial Zone',
    date: '2026-02-08',
    status: 'Completed',
    type: 'Quarterly Review',
  },
  {
    reportId: 'RPT-2026-010',
    area: 'Durg Industrial Zone',
    date: '2026-02-05',
    status: 'Completed',
    type: 'Monthly Compliance',
  },
  {
    reportId: 'RPT-2026-009',
    area: 'All Industrial Areas',
    date: '2026-01-30',
    status: 'Processing',
    type: 'Annual Summary',
  },
  {
    reportId: 'RPT-2026-008',
    area: 'Korba Industrial Complex',
    date: '2026-01-28',
    status: 'Completed',
    type: 'Encroachment Report',
  },
];

export default function Reports() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Processing
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Generate and download compliance reports</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <p className="text-sm text-gray-600">Total Reports</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">47</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <p className="text-2xl font-bold text-green-900">43</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <p className="text-sm text-gray-600">Processing</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">3</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            <p className="text-sm text-gray-600">This Month</p>
          </div>
          <p className="text-2xl font-bold text-purple-900">8</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Report ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Report Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Area</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Generated Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportsData.map((report, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{report.reportId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{report.type}</td>
                  <td className="px-6 py-4 text-gray-700">{report.area}</td>
                  <td className="px-6 py-4 text-gray-700">{report.date}</td>
                  <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {report.status === 'Completed' && (
                        <>
                          <button className="p-2 text-teal-700 hover:bg-teal-50 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-teal-700 hover:bg-teal-50 rounded transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {report.status === 'Processing' && (
                        <span className="text-sm text-gray-500">Generating...</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Generate New Report</h3>
              <p className="text-sm text-gray-600 mt-1">Configure report parameters</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none">
                  <option>Monthly Compliance Report</option>
                  <option>Quarterly Review Report</option>
                  <option>Annual Summary Report</option>
                  <option>Encroachment Report</option>
                  <option>Change Detection Report</option>
                  <option>Custom Report</option>
                </select>
              </div>

              {/* Industrial Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industrial Area</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none">
                  <option>All Industrial Areas</option>
                  <option>Raipur Industrial Zone</option>
                  <option>Bhilai Industrial Zone</option>
                  <option>Durg Industrial Zone</option>
                  <option>Rajnandgaon Industrial Area</option>
                  <option>Korba Industrial Complex</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Include Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Include in Report</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                    <span className="text-sm text-gray-700">Summary Statistics</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                    <span className="text-sm text-gray-700">Encroachment Details</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                    <span className="text-sm text-gray-700">Risk Distribution Analysis</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                    <span className="text-sm text-gray-700">Map Snapshots</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                    <span className="text-sm text-gray-700">Detailed Plot List</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
