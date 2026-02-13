import { useState } from 'react';
import { ArrowLeftRight, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const significantChanges = [
  { plotId: 'IND-1234', changeType: 'Built-Up Increase', magnitude: 85, t1: 3200, t2: 4200 },
  { plotId: 'IND-5678', changeType: 'Built-Up Increase', magnitude: 72, t1: 2100, t2: 2800 },
  { plotId: 'IND-9012', changeType: 'Built-Up Increase', magnitude: 45, t1: 3500, t2: 3900 },
  { plotId: 'IND-3456', changeType: 'Vegetation Loss', magnitude: 38, t1: 4800, t2: 1200 },
  { plotId: 'IND-7890', changeType: 'Built-Up Increase', magnitude: 92, t1: 2100, t2: 2650 },
];

export default function ChangeDetection() {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Change Detection Analysis</h2>
          <p className="text-sm text-gray-600 mt-1">Temporal analysis of built-up area changes</p>
        </div>
        <button className="px-4 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Change Summary
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Total Changes</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">127</p>
          <p className="text-xs text-gray-500 mt-1">plots affected</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Built-Up Increase</p>
          </div>
          <p className="text-2xl font-bold text-green-900">+12.3%</p>
          <p className="text-xs text-gray-500 mt-1">average growth</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Significant Changes</p>
          </div>
          <p className="text-2xl font-bold text-orange-900">47</p>
          <p className="text-xs text-gray-500 mt-1">require review</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ArrowLeftRight className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Analysis Period</p>
          </div>
          <p className="text-lg font-bold text-gray-900">T1 vs T2</p>
          <p className="text-xs text-gray-500 mt-1">6 months interval</p>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Before/After Comparison</h3>
        
        <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ width: '100%', height: '500px' }}>
          {/* T1 Image (Before) */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1546833998-07256bcc76ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFwJTIwZ2Vvc3BhdGlhbCUyMEluZGlhJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzA5MTg3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="T1 - Before"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-900">T1 (Before) - Jan 2025</p>
            </div>
          </div>

          {/* T2 Image (After) - Clipped */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 ${100 - sliderPosition}% 0)` }}
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1546833998-07256bcc76ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFwJTIwZ2Vvc3BhdGlhbCUyMEluZGlhJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzA5MTg3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="T2 - After"
              className="w-full h-full object-cover brightness-110"
            />
            <div className="absolute top-4 right-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-900">T2 (After) - Feb 2026</p>
            </div>
          </div>

          {/* Slider Handle - Horizontal Bar */}
          <div
            className="absolute left-0 right-0 h-1 bg-white shadow-lg cursor-ns-resize z-10"
            style={{ top: `${sliderPosition}%` }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center rotate-90">
              <ArrowLeftRight className="w-5 h-5 text-gray-700" />
            </div>
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-20"
            style={{ writingMode: 'bt-lr', appearance: 'slider-vertical', WebkitAppearance: 'slider-vertical' }}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => setSliderPosition(0)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Show T1 Only
          </button>
          <button
            onClick={() => setSliderPosition(50)}
            className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 text-sm"
          >
            50/50 Split
          </button>
          <button
            onClick={() => setSliderPosition(100)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Show T2 Only
          </button>
        </div>
      </div>

      {/* Change Heatmap Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Change Magnitude Legend</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">No Change</span>
          <div className="flex-1 h-8 rounded bg-gradient-to-r from-green-200 via-yellow-300 via-orange-400 to-red-600"></div>
          <span className="text-sm text-gray-600">High Change</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="w-full h-4 bg-green-200 rounded mb-1"></div>
            <p className="text-xs text-gray-600">0-25%</p>
          </div>
          <div>
            <div className="w-full h-4 bg-yellow-300 rounded mb-1"></div>
            <p className="text-xs text-gray-600">25-50%</p>
          </div>
          <div>
            <div className="w-full h-4 bg-orange-400 rounded mb-1"></div>
            <p className="text-xs text-gray-600">50-75%</p>
          </div>
          <div>
            <div className="w-full h-4 bg-red-600 rounded mb-1"></div>
            <p className="text-xs text-gray-600">75-100%</p>
          </div>
        </div>
      </div>

      {/* Significant Changes Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Significant Changes Detected</h3>
          <p className="text-sm text-gray-600 mt-1">Plots with major built-up area changes</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Plot ID</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Change Type</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">T1 Area (m²)</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">T2 Area (m²)</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Change %</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Magnitude</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {significantChanges.map((change, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{change.plotId}</td>
                  <td className="px-6 py-4 text-gray-700">{change.changeType}</td>
                  <td className="px-6 py-4 text-gray-700">{change.t1.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-700">{change.t2.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-medium">
                      +{(((change.t2 - change.t1) / change.t1) * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            change.magnitude >= 75
                              ? 'bg-red-600'
                              : change.magnitude >= 50
                              ? 'bg-orange-400'
                              : 'bg-yellow-300'
                          }`}
                          style={{ width: `${change.magnitude}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{change.magnitude}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-teal-700 hover:text-teal-800 font-medium">View</button>
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