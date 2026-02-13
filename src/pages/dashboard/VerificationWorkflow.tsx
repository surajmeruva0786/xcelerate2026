import { GripVertical, User, AlertCircle } from 'lucide-react';

const workflowColumns = [
  {
    title: 'Pending Review',
    color: 'bg-gray-100 border-gray-300',
    items: [
      { plotId: 'IND-1234', issueType: 'Encroachment', riskScore: 78, officer: 'Unassigned' },
      { plotId: 'IND-7890', issueType: 'Built-Up Exceeded', riskScore: 85, officer: 'Unassigned' },
      { plotId: 'IND-2345', issueType: 'Road Deviation', riskScore: 62, officer: 'Unassigned' },
      { plotId: 'IND-4567', issueType: 'Vacant Plot', riskScore: 35, officer: 'Unassigned' },
    ],
  },
  {
    title: 'Field Verification Required',
    color: 'bg-blue-50 border-blue-300',
    items: [
      { plotId: 'IND-9012', issueType: 'Encroachment', riskScore: 62, officer: 'R. Sharma' },
      { plotId: 'IND-3456', issueType: 'Built-Up Exceeded', riskScore: 58, officer: 'A. Patel' },
      { plotId: 'IND-6789', issueType: 'Unauthorized Construction', riskScore: 72, officer: 'R. Sharma' },
    ],
  },
  {
    title: 'Action Taken',
    color: 'bg-orange-50 border-orange-300',
    items: [
      { plotId: 'IND-5432', issueType: 'Encroachment', riskScore: 48, officer: 'M. Singh' },
      { plotId: 'IND-8765', issueType: 'Road Deviation', riskScore: 55, officer: 'A. Patel' },
    ],
  },
  {
    title: 'Closed',
    color: 'bg-green-50 border-green-300',
    items: [
      { plotId: 'IND-1111', issueType: 'Encroachment Resolved', riskScore: 0, officer: 'R. Sharma' },
      { plotId: 'IND-2222', issueType: 'Compliance Restored', riskScore: 0, officer: 'M. Singh' },
      { plotId: 'IND-3333', issueType: 'False Positive', riskScore: 0, officer: 'A. Patel' },
    ],
  },
];

export default function VerificationWorkflow() {
  const getRiskBadge = (score: number) => {
    if (score >= 70) return 'bg-red-100 text-red-700 border-red-300';
    if (score >= 50) return 'bg-orange-100 text-orange-700 border-orange-300';
    if (score > 0) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verification Workflow</h2>
          <p className="text-sm text-gray-600 mt-1">Manage field verification and approval process</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none text-sm">
            <option>All Officers</option>
            <option>R. Sharma</option>
            <option>A. Patel</option>
            <option>M. Singh</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none text-sm">
            <option>All Areas</option>
            <option>Raipur Industrial Zone</option>
            <option>Bhilai Industrial Zone</option>
            <option>Durg Industrial Zone</option>
          </select>
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-gray-900">{workflowColumns[0].items.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Field Verification</p>
          <p className="text-2xl font-bold text-blue-900">{workflowColumns[1].items.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Action Taken</p>
          <p className="text-2xl font-bold text-orange-900">{workflowColumns[2].items.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Closed</p>
          <p className="text-2xl font-bold text-green-900">{workflowColumns[3].items.length}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-x-auto">
          {workflowColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="min-w-[280px]">
              {/* Column Header */}
              <div className={`${column.color} border-2 rounded-lg p-4 mb-4`}>
                <h3 className="font-bold text-gray-900 mb-1">{column.title}</h3>
                <p className="text-sm text-gray-600">{column.items.length} items</p>
              </div>

              {/* Column Items */}
              <div className="space-y-3">
                {column.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-move group"
                  >
                    {/* Drag Handle */}
                    <div className="flex items-start justify-between mb-3">
                      <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                      <span
                        className={`px-2 py-1 rounded border text-xs font-medium ml-2 ${getRiskBadge(
                          item.riskScore
                        )}`}
                      >
                        {item.riskScore > 0 ? `Risk: ${item.riskScore}` : 'Resolved'}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="space-y-2">
                      <p className="font-bold text-gray-900">{item.plotId}</p>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-700">{item.issueType}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-100">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{item.officer}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                ))}

                {/* Add Card Button */}
                {columnIndex === 0 && (
                  <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-teal-600 hover:text-teal-700 transition-colors text-sm font-medium">
                    + Add Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Officer Assignment Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Field Officers</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: 'R. Sharma', assigned: 5, completed: 23, area: 'Raipur Zone' },
            { name: 'A. Patel', assigned: 4, completed: 18, area: 'Bhilai Zone' },
            { name: 'M. Singh', assigned: 3, completed: 31, area: 'Durg Zone' },
          ].map((officer, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{officer.name}</p>
                  <p className="text-xs text-gray-500">{officer.area}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned:</span>
                  <span className="font-medium text-gray-900">{officer.assigned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">{officer.completed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
