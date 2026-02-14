import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Plus, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function Reports() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
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

  const reportsSummary = analysisResults?.dashboard_insights?.reports_summary || {};
  // Construct a list of "recent reports" including the one just generated if available
  const reportsList = [
    {
      id: 'RPT-LATEST',
      type: 'Comprehensive Analysis',
      area: analysisResults?.zone || 'Selected Zone',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      summary: reportsSummary
    },
    // Mock history for demo purposes
    { id: 'RPT-2026-001', type: 'Monthly Compliance', area: 'Raipur Zone', date: '2026-01-15', status: 'Completed' },
    { id: 'RPT-2025-128', type: 'Annual Summary', area: 'Bhilai Zone', date: '2025-12-31', status: 'Archive' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Generate and download compliance reports</p>
        </div>

      </div>

      {/* Latest Report Summary */}
      {analysisResults && (
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-teal-900 mb-2">Latest Analysis Summary</h3>
          <p className="text-gray-700 mb-4">{reportsSummary?.executive_summary || "No summary available."}</p>
          <div className="flex gap-4">

            <button
              onClick={async () => {
                if (!analysisResults) return;
                try {
                  const response = await fetch('http://localhost:5000/api/generate-report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(analysisResults),
                  });

                  if (!response.ok) throw new Error('Report generation failed');

                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Report_${analysisResults.zone}_${new Date().toISOString().split('T')[0]}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                } catch (error) {
                  console.error("Download failed:", error);
                  alert("Failed to download report. Please check backend logs.");
                }
              }}
              className="px-4 py-2 bg-teal-700 text-white rounded-md shadow-sm text-sm font-medium hover:bg-teal-800 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Detailed Plot Status (AI Identified) */}
      {analysisResults?.dashboard_insights?.plot_status && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-purple-600 rounded-sm"></span>
            AI Identified Plot Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center justify-between">
                Encroachment Risk
                <span className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded-full">
                  {analysisResults.dashboard_insights.plot_status.encroachment_plots?.length || 0}
                </span>
              </h4>
              <p className="text-sm text-gray-600 mb-2">Plots with detected boundary violations</p>
              <div className="flex flex-wrap gap-2">
                {analysisResults.dashboard_insights.plot_status.encroachment_plots?.length > 0 ? (
                  analysisResults.dashboard_insights.plot_status.encroachment_plots.map((plot: string) => (
                    <span key={plot} className="px-2 py-1 bg-white border border-red-200 text-red-700 text-xs font-medium rounded">
                      {plot}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">None detected</span>
                )}
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h4 className="font-semibold text-amber-800 mb-2 flex items-center justify-between">
                Idle / Vacant
                <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                  {analysisResults.dashboard_insights.plot_status.idle_plots?.length || 0}
                </span>
              </h4>
              <p className="text-sm text-gray-600 mb-2">Plots appearing undeveloped or empty</p>
              <div className="flex flex-wrap gap-2">
                {analysisResults.dashboard_insights.plot_status.idle_plots?.length > 0 ? (
                  analysisResults.dashboard_insights.plot_status.idle_plots.map((plot: string) => (
                    <span key={plot} className="px-2 py-1 bg-white border border-amber-200 text-amber-700 text-xs font-medium rounded">
                      {plot}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">None detected</span>
                )}
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h4 className="font-semibold text-emerald-800 mb-2 flex items-center justify-between">
                Low Vegetation
                <span className="bg-emerald-200 text-emerald-800 text-xs px-2 py-0.5 rounded-full">
                  {analysisResults.dashboard_insights.plot_status.low_vegetation_plots?.length || 0}
                </span>
              </h4>
              <p className="text-sm text-gray-600 mb-2">Plots with minimal green cover</p>
              <div className="flex flex-wrap gap-2">
                {analysisResults.dashboard_insights.plot_status.low_vegetation_plots?.length > 0 ? (
                  analysisResults.dashboard_insights.plot_status.low_vegetation_plots.map((plot: string) => (
                    <span key={plot} className="px-2 py-1 bg-white border border-emerald-200 text-emerald-700 text-xs font-medium rounded">
                      {plot}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">None detected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
              {reportsList.map((report, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{report.id}</td>
                  <td className="px-6 py-4 text-gray-700">{report.type}</td>
                  <td className="px-6 py-4 text-gray-700">{report.area}</td>
                  <td className="px-6 py-4 text-gray-700">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${report.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600'
                      }`}>
                      <CheckCircle className="w-3 h-3" />
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-teal-700 hover:bg-teal-50 rounded transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-teal-700 hover:bg-teal-50 rounded transition-colors"><Download className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
