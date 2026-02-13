import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

const alerts = [
  {
    plotId: 'IND-1234',
    issueType: 'Encroachment Detected',
    severity: 'High',
    status: 'Pending',
    date: '2026-02-12',
  },
  {
    plotId: 'IND-5678',
    issueType: 'Built-Up Area Exceeded',
    severity: 'Medium',
    status: 'Under Review',
    date: '2026-02-11',
  },
  {
    plotId: 'IND-9012',
    issueType: 'Road Deviation',
    severity: 'Medium',
    status: 'Pending',
    date: '2026-02-10',
  },
  {
    plotId: 'IND-3456',
    issueType: 'Vacant Plot > 2 Years',
    severity: 'Low',
    status: 'Notification Sent',
    date: '2026-02-09',
  },
  {
    plotId: 'IND-7890',
    issueType: 'Unauthorized Construction',
    severity: 'High',
    status: 'Field Verification',
    date: '2026-02-08',
  },
];

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'High':
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    case 'Medium':
      return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    default:
      return <Info className="w-4 h-4 text-blue-600" />;
  }
};

const getSeverityBadge = (severity: string) => {
  const colors = {
    High: 'bg-red-50 text-red-700 border-red-200',
    Medium: 'bg-orange-50 text-orange-700 border-orange-200',
    Low: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return colors[severity as keyof typeof colors] || colors.Low;
};

const getStatusBadge = (status: string) => {
  const colors = {
    Pending: 'bg-gray-50 text-gray-700 border-gray-200',
    'Under Review': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Notification Sent': 'bg-blue-50 text-blue-700 border-blue-200',
    'Field Verification': 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return colors[status as keyof typeof colors] || colors.Pending;
};

export function RecentAlertsTable() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900">Recent Alerts</h3>
          <p className="text-sm text-gray-600">Latest compliance issues requiring attention</p>
        </div>
        <button className="text-sm text-teal-700 hover:text-teal-800 font-medium">
          View All →
        </button>
      </div>
      
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Plot ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Issue Type</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Severity</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {alerts.map((alert, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{alert.plotId}</td>
                <td className="px-4 py-3 text-gray-700">{alert.issueType}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${getSeverityBadge(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                    {alert.severity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded-md border text-xs font-medium ${getStatusBadge(alert.status)}`}>
                    {alert.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-teal-700 hover:text-teal-800 font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
        Showing 5 of 47 alerts · Last updated 2 hours ago
      </div>
    </div>
  );
}
