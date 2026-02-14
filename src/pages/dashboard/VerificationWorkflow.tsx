import { useState, useEffect } from 'react';
import { GripVertical, User, AlertCircle } from 'lucide-react';

export default function VerificationWorkflow() {
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

  // Transform backend data into Kanban columns
  const workflowData = analysisResults?.dashboard_insights?.verification_workflow || [];

  // Create default columns if data is missing or structurally different
  const pendingItems = workflowData.filter((i: any) => i.status === 'Pending' || !i.status) || [];
  const fieldItems = workflowData.filter((i: any) => i.status === 'Field Verification') || [];
  const actionItems = workflowData.filter((i: any) => i.status === 'Action Taken') || [];
  const closedItems = workflowData.filter((i: any) => i.status === 'Closed') || [];

  const workflowColumns = [
    { title: 'Pending Review', color: 'bg-gray-100 border-gray-300', items: pendingItems },
    { title: 'Field Verification Required', color: 'bg-blue-50 border-blue-300', items: fieldItems },
    { title: 'Action Taken', color: 'bg-orange-50 border-orange-300', items: actionItems },
    { title: 'Closed', color: 'bg-green-50 border-green-300', items: closedItems },
  ];

  const getRiskBadge = (score: string | number) => {
    // Handle both numeric and string risk levels
    const s = String(score).toLowerCase();
    if (s === 'critical' || s === 'high' || Number(score) > 75) return 'bg-red-100 text-red-700 border-red-300';
    if (s === 'medium' || (Number(score) > 40 && Number(score) <= 75)) return 'bg-orange-100 text-orange-700 border-orange-300';
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
                {column.items.length > 0 ? (
                  column.items.map((item: any, itemIndex: number) => (
                    <div
                      key={itemIndex}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-move group"
                    >
                      {/* Drag Handle */}
                      <div className="flex items-start justify-between mb-3">
                        <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                        <span className={`px-2 py-1 rounded border text-xs font-medium ml-2 ${getRiskBadge(item.riskLevel || item.riskScore || 'Low')}`}>
                          {item.riskLevel || 'Normal'}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="space-y-2">
                        <p className="font-bold text-gray-900">{item.plotId || 'Unknown Plot'}</p>

                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="text-gray-700">{item.issue || 'Verification Task'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-100">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{item.assignedTo || 'Unassigned'}</span>
                        </div>
                      </div>

                      <button className="w-full mt-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-sm font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm">No items</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
