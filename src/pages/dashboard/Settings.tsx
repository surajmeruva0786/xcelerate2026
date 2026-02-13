import { useState } from 'react';
import { Shield, Sliders, MapPin, Satellite, Save } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('risk-scoring');

  const tabs = [
    { id: 'risk-scoring', label: 'Risk Scoring Rules', icon: Shield },
    { id: 'thresholds', label: 'Threshold Settings', icon: Sliders },
    { id: 'area-management', label: 'Area Management', icon: MapPin },
    { id: 'satellite', label: 'Satellite Configuration', icon: Satellite },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Configure system parameters and thresholds</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Risk Scoring Rules Tab */}
          {activeTab === 'risk-scoring' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Risk Scoring Configuration</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Configure how risk scores are calculated for each compliance factor
                </p>
              </div>

              <div className="space-y-6">
                {/* Encroachment Weight */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-medium text-gray-900">Encroachment Area Weight</label>
                    <span className="text-2xl font-bold text-teal-700">40%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="40" className="w-full" />
                  <p className="text-xs text-gray-500 mt-2">
                    Impact of encroachment area on overall risk score
                  </p>
                </div>

                {/* Built-Up Compliance Weight */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-medium text-gray-900">Built-Up Compliance Weight</label>
                    <span className="text-2xl font-bold text-teal-700">30%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="30" className="w-full" />
                  <p className="text-xs text-gray-500 mt-2">
                    Impact of built-up area compliance on risk score
                  </p>
                </div>

                {/* Vacant Period Weight */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-medium text-gray-900">Vacant Period Weight</label>
                    <span className="text-2xl font-bold text-teal-700">20%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="20" className="w-full" />
                  <p className="text-xs text-gray-500 mt-2">Duration of plot vacancy impact on risk</p>
                </div>

                {/* Road Deviation Weight */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-medium text-gray-900">Road Deviation Weight</label>
                    <span className="text-2xl font-bold text-teal-700">10%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="10" className="w-full" />
                  <p className="text-xs text-gray-500 mt-2">Road alignment deviation impact on risk</p>
                </div>
              </div>

              {/* Risk Level Thresholds */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Risk Level Classification</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-900 mb-2">Low Risk</p>
                    <input
                      type="number"
                      defaultValue="0"
                      className="w-full px-3 py-2 border border-green-300 rounded mb-1 text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      defaultValue="49"
                      className="w-full px-3 py-2 border border-green-300 rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-orange-900 mb-2">Medium Risk</p>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full px-3 py-2 border border-orange-300 rounded mb-1 text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      defaultValue="69"
                      className="w-full px-3 py-2 border border-orange-300 rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-900 mb-2">High Risk</p>
                    <input
                      type="number"
                      defaultValue="70"
                      className="w-full px-3 py-2 border border-red-300 rounded mb-1 text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full px-3 py-2 border border-red-300 rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Threshold Settings Tab */}
          {activeTab === 'thresholds' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Detection Thresholds</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Adjust detection sensitivity for various compliance parameters
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Built-Up Threshold (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="65"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum confidence for built-up area classification
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Encroachment Threshold (m²)
                  </label>
                  <input
                    type="number"
                    defaultValue="50"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum area to flag as encroachment</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cloud Filter (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="20"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum cloud coverage in satellite imagery
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vacant Period Alert (months)
                  </label>
                  <input
                    type="number"
                    defaultValue="24"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Months before vacant plot alert</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Detection Threshold (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="15"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum change to flag for review
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Road Deviation Tolerance (meters)
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Acceptable deviation from approved road layout
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Area Management Tab */}
          {activeTab === 'area-management' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Industrial Areas</h3>
                  <p className="text-sm text-gray-600">Manage registered industrial zones</p>
                </div>
                <button className="px-4 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors">
                  Add New Area
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Raipur Industrial Zone', plots: 347, area: '1,250 hectares' },
                  { name: 'Bhilai Industrial Zone', plots: 289, area: '980 hectares' },
                  { name: 'Durg Industrial Zone', plots: 234, area: '850 hectares' },
                  { name: 'Rajnandgaon Industrial Area', plots: 178, area: '620 hectares' },
                  { name: 'Korba Industrial Complex', plots: 199, area: '710 hectares' },
                ].map((area, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <MapPin className="w-5 h-5 text-teal-700" />
                      <div>
                        <p className="font-medium text-gray-900">{area.name}</p>
                        <p className="text-sm text-gray-600">
                          {area.plots} plots · {area.area}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-teal-700 hover:bg-teal-50 rounded text-sm font-medium">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-red-700 hover:bg-red-50 rounded text-sm font-medium">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Satellite Configuration Tab */}
          {activeTab === 'satellite' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Satellite Data Configuration</h3>
                <p className="text-sm text-gray-600 mb-6">Configure satellite imagery sources and preferences</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Satellite Source
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none">
                    <option>Sentinel-2 (10m resolution)</option>
                    <option>Landsat 8 (30m resolution)</option>
                    <option>Planet Labs (3m resolution)</option>
                    <option>CARTOSAT-3 (0.25m resolution)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fallback Source
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none">
                    <option>Landsat 8 (30m resolution)</option>
                    <option>Sentinel-2 (10m resolution)</option>
                    <option>None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Data Acquisition Preferences
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600"
                      />
                      <span className="text-sm text-gray-700">Prefer latest available imagery</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600"
                      />
                      <span className="text-sm text-gray-700">Auto-reject high cloud coverage</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600"
                      />
                      <span className="text-sm text-gray-700">Download raw satellite data for archive</span>
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Endpoint
                    </label>
                    <input
                      type="text"
                      defaultValue="https://api.sentinel-hub.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="password"
                      defaultValue="••••••••••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Reset
          </button>
          <button className="px-6 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
