import { useState, useEffect } from 'react';
import { Calendar, Satellite, Settings as SettingsIcon, Save, Bell, AlertTriangle } from 'lucide-react';

export default function MonitoringScheduler() {
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

  const scheduleData = analysisResults?.dashboard_insights?.monitoring_schedule || [];
  // Fallback or derived data if scheduleData is empty or just a summary
  const nextRun = scheduleData.length > 0 ? scheduleData[0]?.nextScheduledRun : 'Mar 1, 2026';
  const frequency = scheduleData.length > 0 ? scheduleData[0]?.frequency : 'Monthly';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Monitoring Scheduler</h2>
        <p className="text-sm text-gray-600 mt-1">Configure automated monitoring schedules and parameters</p>
      </div>

      {/* Current Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <p className="text-sm text-gray-600">Current Frequency</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{frequency}</p>
          <p className="text-xs text-gray-500 mt-1">Automated Interval</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Satellite className="w-6 h-6 text-purple-600" />
            <p className="text-sm text-gray-600">Satellite Source</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">Sentinel-2</p>
          <p className="text-xs text-gray-500 mt-1">10m resolution (Optical)</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-green-600" />
            <p className="text-sm text-gray-600">Next Scheduled Run</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{nextRun}</p>
          <p className="text-xs text-gray-500 mt-1">Auto-scheduled</p>
        </div>
      </div>

      {/* Recommended Schedule from AI */}
      {analysisResults?.dashboard_insights?.recommendations && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-teal-700 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-teal-800 text-sm">AI Recommendation</h4>
            <p className="text-sm text-teal-700">
              {analysisResults.dashboard_insights.recommendations[0] || "Based on recent activity, maintaining the current schedule is advised."}
            </p>
          </div>
        </div>
      )}

      {/* Schedule Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Schedule Configuration</h3>
        </div>

        <div className="space-y-6">
          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monitoring Frequency
            </label>
            <select
              defaultValue={frequency}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
            >
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Semi-Annual</option>
              <option>Annual</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">How often should the automated analysis run?</p>
          </div>

          {/* Satellite Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Satellite Source
            </label>
            <select
              defaultValue="Sentinel-2 (10m resolution)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
            >
              <option>Sentinel-2 (10m resolution)</option>
              <option>Landsat 8 (30m resolution)</option>
              <option>Planet Labs (3m resolution)</option>
            </select>
          </div>

          {/* Cloud Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cloud Threshold (%)
            </label>
            <input type="range" min="0" max="100" defaultValue="20" className="w-full" />
            <p className="text-xs text-gray-500 mt-1">Max acceptable cloud cover: 20%</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <button className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Reset to Defaults
        </button>
        <button className="px-6 py-3 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Configuration
        </button>
      </div>
    </div>
  );
}