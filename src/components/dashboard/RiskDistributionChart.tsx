import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Low Risk', value: 876, color: '#10B981' },
  { name: 'Medium Risk', value: 348, color: '#F59E0B' },
  { name: 'High Risk', value: 23, color: '#EF4444' },
];

export function RiskDistributionChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900">Risk Distribution</h3>
        <p className="text-sm text-gray-600">Plot categorization by risk level</p>
      </div>
      
      <div style={{ width: '100%', height: 256 }}>
        {mounted && (
          <ResponsiveContainer width="100%" height={256}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs text-gray-600">{item.name}</span>
            </div>
            <p className="font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
