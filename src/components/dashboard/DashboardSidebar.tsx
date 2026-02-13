import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  AlertTriangle,
  Radar,
  FileText,
  Calendar,
  GitBranch,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/areas', label: 'Industrial Areas', icon: Building2 },
  { path: '/dashboard/plots', label: 'Plot Compliance', icon: ClipboardCheck, badge: 12 },
  { path: '/dashboard/encroachments', label: 'Encroachments', icon: AlertTriangle, badge: 5 },
  { path: '/dashboard/change-detection', label: 'Change Detection', icon: Radar },
  { path: '/dashboard/reports', label: 'Reports', icon: FileText },
  { path: '/dashboard/scheduler', label: 'Monitoring Scheduler', icon: Calendar },
  { path: '/dashboard/verification', label: 'Verification Workflow', icon: GitBranch },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  { path: '/dashboard/admin', label: 'Admin', icon: Shield },
];

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 relative flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-700 rounded flex items-center justify-center text-white font-bold text-xs">
              CS
            </div>
            <span className="font-bold text-gray-900 text-sm">CSIDC GIS</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-teal-700 rounded flex items-center justify-center text-white font-bold text-xs mx-auto">
            CS
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                      isActive
                        ? 'bg-teal-50 text-teal-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="text-sm flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </aside>
  );
}
