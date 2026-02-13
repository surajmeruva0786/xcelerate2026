import { ZoomIn, Layers, Maximize2 } from 'lucide-react';
import { useState } from 'react';

export function MapPreview() {
  const [hoveredPlot, setHoveredPlot] = useState<number | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);

  // Sample industrial plots with risk levels
  const industrialPlots = [
    { id: 'IND-1234', name: 'Raipur Zone A', x: 35, y: 45, risk: 'high', area: 150, size: 45 },
    { id: 'IND-7890', name: 'Durg Zone B', x: 28, y: 48, risk: 'high', area: 150, size: 45 },
    { id: 'IND-9012', name: 'Bhilai Zone C', x: 30, y: 50, risk: 'medium', area: 80, size: 35 },
    { id: 'IND-4567', name: 'Korba Industrial Area', x: 55, y: 20, risk: 'low', area: 45, size: 28 },
    { id: 'IND-3456', name: 'Bilaspur Park', x: 60, y: 30, risk: 'low', area: 30, size: 25 },
    { id: 'IND-5678', name: 'Raigarh Zone', x: 75, y: 42, risk: 'medium', area: 95, size: 38 },
    { id: 'IND-2345', name: 'Rajnandgaon Area', x: 20, y: 52, risk: 'low', area: 55, size: 30 },
    { id: 'IND-6789', name: 'Janjgir-Champa', x: 48, y: 35, risk: 'medium', area: 70, size: 32 },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f97316'; // orange
      case 'low':
        return '#22c55e'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900">Industrial Area Map</h3>
          <p className="text-sm text-gray-600">Color-coded plots by risk level</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Maximize2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-teal-50 via-blue-50 to-green-50" style={{ height: '320px' }}>
        {/* Map Background with Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* State Outline (Simplified Chhattisgarh shape) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 15,25 L 25,15 L 40,18 L 55,12 L 70,15 L 82,22 L 88,35 L 85,50 L 80,60 L 70,70 L 55,75 L 40,72 L 28,68 L 18,58 L 12,45 L 15,30 Z"
            fill="#0d9488"
            fillOpacity="0.15"
            stroke="#0d9488"
            strokeWidth="0.5"
            strokeDasharray="3,2"
          />
        </svg>

        {/* Road Network Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <line x1="20" y1="50" x2="80" y2="45" stroke="#cbd5e1" strokeWidth="0.3" strokeDasharray="2,2" />
          <line x1="35" y1="20" x2="40" y2="70" stroke="#cbd5e1" strokeWidth="0.3" strokeDasharray="2,2" />
          <line x1="55" y1="15" x2="60" y2="75" stroke="#cbd5e1" strokeWidth="0.3" strokeDasharray="2,2" />
        </svg>

        {/* Industrial Plots */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {industrialPlots.map((plot, index) => (
            <g key={index}>
              <circle
                cx={plot.x}
                cy={plot.y}
                r={plot.size / 2}
                fill={getRiskColor(plot.risk)}
                fillOpacity={hoveredPlot === index ? 0.8 : 0.6}
                stroke={getRiskColor(plot.risk)}
                strokeWidth={hoveredPlot === index ? 0.8 : 0.4}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredPlot(index)}
                onMouseLeave={() => setHoveredPlot(null)}
                onClick={() => setSelectedPlot(selectedPlot === index ? null : index)}
                style={{
                  filter: hoveredPlot === index ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  transform: hoveredPlot === index ? 'scale(1.1)' : 'scale(1)',
                  transformOrigin: `${plot.x}% ${plot.y}%`,
                }}
              />
              {/* Pulse animation for high risk plots */}
              {plot.risk === 'high' && (
                <circle
                  cx={plot.x}
                  cy={plot.y}
                  r={plot.size / 2}
                  fill="none"
                  stroke={getRiskColor(plot.risk)}
                  strokeWidth="0.3"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    from={plot.size / 2}
                    to={plot.size / 2 + 3}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          ))}
        </svg>

        {/* Tooltip on Hover */}
        {hoveredPlot !== null && (
          <div
            className="absolute bg-white rounded-lg shadow-xl border border-gray-200 p-3 pointer-events-none z-50"
            style={{
              left: `${industrialPlots[hoveredPlot].x}%`,
              top: `${industrialPlots[hoveredPlot].y}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <div className="text-xs">
              <div className="font-bold text-gray-900">{industrialPlots[hoveredPlot].id}</div>
              <div className="text-gray-600">{industrialPlots[hoveredPlot].name}</div>
              <div className="text-gray-500 mt-1">
                Encroached: <span className="font-semibold">{industrialPlots[hoveredPlot].area} m²</span>
              </div>
              <div className="mt-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getRiskBgColor(industrialPlots[hoveredPlot].risk)}`}>
                  {industrialPlots[hoveredPlot].risk.toUpperCase()} RISK
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <p className="text-xs font-semibold text-gray-700 mb-2">Risk Level</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-700">High Risk</span>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Layers className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">247</span> plots visible
        </p>
        <button className="text-sm text-teal-700 hover:text-teal-800 font-medium">
          Open Full Map →
        </button>
      </div>
    </div>
  );
}
