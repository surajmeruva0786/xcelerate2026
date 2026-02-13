import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, ChevronDown, User, LogOut, Settings, Calendar, Play } from 'lucide-react';

export function DashboardHeader() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Title */}
      <div>
        <h1 className="font-bold text-gray-900">CSIDC Land Compliance Monitoring</h1>
        <p className="text-xs text-gray-500">Industrial Zone Management System</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Area Selector */}
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none">
          <option>All Industrial Areas</option>
          <option>Gondwara</option>
          <option>Kapan</option>
          <option>Amaseoni</option>
        </select>

        {/* Date Range Selector */}
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-gray-700">T1 vs T2</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {/* Run Analysis Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg text-sm font-medium transition-colors">
          <Play className="w-4 h-4" />
          Run Analysis
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                    <p className="text-sm text-gray-900 font-medium">High-risk plot detected</p>
                    <p className="text-xs text-gray-600 mt-1">Plot ID: IND-{1234 + i} - Encroachment alert</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-xs text-teal-700 hover:text-teal-800 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-teal-700" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <Settings className="w-4 h-4" />
                Profile Settings
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 border-t border-gray-100 mt-2 pt-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
