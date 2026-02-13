import { Calendar, Satellite, Cloud, Settings as SettingsIcon, Save, Bell } from 'lucide-react';

export default function MonitoringScheduler() {
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
          <p className="text-2xl font-bold text-gray-900">Monthly</p>
          <p className="text-xs text-gray-500 mt-1">Every 1st of month</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Satellite className="w-6 h-6 text-purple-600" />
            <p className="text-sm text-gray-600">Satellite Source</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">Sentinel-2</p>
          <p className="text-xs text-gray-500 mt-1">10m resolution</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-green-600" />
            <p className="text-sm text-gray-600">Next Scheduled Run</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">Mar 1, 2026</p>
          <p className="text-xs text-gray-500 mt-1">16 days remaining</p>
        </div>
      </div>

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
              defaultValue="Monthly"
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

          {/* Day of Month */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day of Month
            </label>
            <input
              type="number"
              min="1"
              max="28"
              defaultValue="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Day of the month to run analysis (1-28)</p>
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
              <option>CARTOSAT-3 (0.25m resolution)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Select satellite imagery source for analysis</p>
          </div>

          {/* Cloud Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cloud Threshold (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="20"
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-12 text-right">20%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum acceptable cloud coverage in imagery (images above threshold will be rejected)
            </p>
          </div>

          {/* Built-Up Detection Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Built-Up Detection Threshold
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="65"
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-12 text-right">65%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Confidence threshold for built-up area classification (higher = more strict)
            </p>
          </div>

          {/* Analysis Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Industrial Areas to Monitor
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                <span className="text-sm text-gray-700">Raipur Industrial Zone</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                <span className="text-sm text-gray-700">Bhilai Industrial Zone</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                <span className="text-sm text-gray-700">Durg Industrial Zone</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                <span className="text-sm text-gray-700">Rajnandgaon Industrial Area</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                <span className="text-sm text-gray-700">Korba Industrial Complex</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Notification Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Email Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Emails
            </label>
            <textarea
              rows={3}
              placeholder="Enter email addresses, one per line"
              defaultValue="admin@csidc.gov.in&#10;monitoring@csidc.gov.in&#10;compliance@csidc.gov.in"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Email addresses to receive monitoring reports and alerts</p>
          </div>

          {/* Notification Triggers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Send Notifications When
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                <span className="text-sm text-gray-700">Analysis completes successfully</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                <span className="text-sm text-gray-700">High-risk encroachments detected</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                <span className="text-sm text-gray-700">Significant built-up area changes</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600" />
                <span className="text-sm text-gray-700">Analysis fails or encounters errors</span>
              </label>
            </div>
          </div>

          {/* Alert Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Threshold for Changes
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="15"
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-12 text-right">15%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum change percentage to trigger notification alert
            </p>
          </div>
        </div>
      </div>

      {/* Next Run Preview */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border border-teal-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Next Scheduled Run</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Scheduled Date & Time</p>
            <p className="text-lg font-bold text-gray-900">March 1, 2026 at 02:00 AM IST</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Estimated Duration</p>
            <p className="text-lg font-bold text-gray-900">45-60 minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Areas to be Analyzed</p>
            <p className="text-lg font-bold text-gray-900">5 Industrial Zones</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Plots</p>
            <p className="text-lg font-bold text-gray-900">1,247 plots</p>
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