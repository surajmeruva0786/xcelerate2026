import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { area: 'Raipur', T1: 450, T2: 520 },
  { area: 'Bhilai', T1: 380, T2: 405 },
  { area: 'Durg', T1: 290, T2: 322 },
  { area: 'Rajnandgaon', T1: 180, T2: 195 },
  { area: 'Korba', T1: 150, T2: 168 },
];

export function BuiltUpChangeChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900">Built-Up Area Change</h3>
        <p className="text-sm text-gray-600">Comparison between T1 (Previous) and T2 (Current) periods</p>
      </div>
      
      <div style={{ width: '100%', height: 256 }}>
        {mounted && (
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="area" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="T1" fill="#9CA3AF" name="T1 (Previous)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="T2" fill="#0F766E" name="T2 (Current)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
        <div>
          <span className="text-gray-600">Average Growth:</span>
          <span className="ml-2 font-bold text-green-600">+12.3%</span>
        </div>
        <button className="text-teal-700 hover:text-teal-800 font-medium">
          View Details →
        </button>
      </div>
    </div>
  );
}
