import { useState } from 'react';
import { Users, Shield, Activity, Database, UserPlus, Search, Edit, Trash2, Eye } from 'lucide-react';

const usersData = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    email: 'r.sharma@csidc.gov.in',
    role: 'Field Officer',
    status: 'Active',
    lastLogin: '2026-02-12 14:23',
  },
  {
    id: 2,
    name: 'Amit Patel',
    email: 'a.patel@csidc.gov.in',
    role: 'Field Officer',
    status: 'Active',
    lastLogin: '2026-02-12 09:45',
  },
  {
    id: 3,
    name: 'Meera Singh',
    email: 'm.singh@csidc.gov.in',
    role: 'Field Officer',
    status: 'Active',
    lastLogin: '2026-02-11 16:12',
  },
  {
    id: 4,
    name: 'Admin User',
    email: 'admin@csidc.gov.in',
    role: 'Administrator',
    status: 'Active',
    lastLogin: '2026-02-13 10:05',
  },
  {
    id: 5,
    name: 'Priya Verma',
    email: 'p.verma@csidc.gov.in',
    role: 'Analyst',
    status: 'Active',
    lastLogin: '2026-02-12 11:30',
  },
];

const auditLogs = [
  {
    timestamp: '2026-02-13 10:05:23',
    user: 'Admin User',
    action: 'Updated risk scoring configuration',
    module: 'Settings',
  },
  {
    timestamp: '2026-02-13 09:45:12',
    user: 'A. Patel',
    action: 'Verified plot IND-5678',
    module: 'Verification Workflow',
  },
  {
    timestamp: '2026-02-13 09:23:45',
    user: 'R. Sharma',
    action: 'Generated compliance report',
    module: 'Reports',
  },
  {
    timestamp: '2026-02-12 16:12:34',
    user: 'M. Singh',
    action: 'Updated plot status IND-5432',
    module: 'Plot Compliance',
  },
  {
    timestamp: '2026-02-12 14:23:11',
    user: 'R. Sharma',
    action: 'Logged in to system',
    module: 'Authentication',
  },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Administrator':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Field Officer':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Analyst':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active'
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-600 mt-1">User management and system administration</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{usersData.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-green-600" />
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <p className="text-2xl font-bold text-green-900">{usersData.filter((u) => u.status === 'Active').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-purple-600" />
            <p className="text-sm text-gray-600">API Requests</p>
          </div>
          <p className="text-2xl font-bold text-purple-900">1,247</p>
          <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-6 h-6 text-orange-600" />
            <p className="text-sm text-gray-600">System Health</p>
          </div>
          <p className="text-2xl font-bold text-green-900">98.5%</p>
          <p className="text-xs text-gray-500 mt-1">Uptime</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'roles'
                ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Role-Based Access
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'audit'
                ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'system'
                ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            System Health
          </button>
        </div>

        <div className="p-6">
          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                  />
                </div>
                <button className="px-4 py-2 bg-[#00C2A8] hover:bg-[#00A893] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">User</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Role</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Last Login</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded border text-xs font-medium ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded border text-xs font-medium ${getStatusBadge(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{user.lastLogin}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Role-Based Access Tab */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <p className="text-sm text-gray-600">Configure permissions for each user role</p>

              <div className="space-y-4">
                {[
                  {
                    role: 'Administrator',
                    color: 'purple',
                    permissions: ['Full System Access', 'User Management', 'Settings Configuration', 'Audit Logs'],
                  },
                  {
                    role: 'Field Officer',
                    color: 'blue',
                    permissions: ['Verification Workflow', 'Plot Compliance View', 'Report Generation'],
                  },
                  {
                    role: 'Analyst',
                    color: 'green',
                    permissions: ['Dashboard View', 'Reports View', 'Change Detection', 'Data Export'],
                  },
                ].map((roleConfig, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Shield className={`w-6 h-6 text-${roleConfig.color}-600`} />
                        <h4 className="font-bold text-gray-900">{roleConfig.role}</h4>
                      </div>
                      <button className="text-teal-700 hover:text-teal-800 text-sm font-medium">Edit Permissions</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {roleConfig.permissions.map((perm, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">System activity and user action logs</p>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  Export Logs
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Timestamp</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">User</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Module</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {auditLogs.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-700 font-mono text-xs">{log.timestamp}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{log.user}</td>
                        <td className="px-6 py-4 text-gray-700">{log.action}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{log.module}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* System Health Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <p className="text-sm text-gray-600">Monitor system performance and health metrics</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* System Uptime */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">System Uptime</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Last 24 hours</span>
                        <span className="font-medium text-green-600">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Last 7 days</span>
                        <span className="font-medium text-green-600">99.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.2%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Last 30 days</span>
                        <span className="font-medium text-green-600">98.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Activity */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">API Activity</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Requests (24h)</span>
                      <span className="font-medium text-gray-900">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="font-medium text-green-600">99.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Response Time</span>
                      <span className="font-medium text-gray-900">245ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Failed Requests</span>
                      <span className="font-medium text-red-600">3</span>
                    </div>
                  </div>
                </div>

                {/* Database Status */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">Database Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Connection Pool</span>
                      <span className="font-medium text-green-600">Healthy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Storage Used</span>
                      <span className="font-medium text-gray-900">234 GB / 500 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Query Performance</span>
                      <span className="font-medium text-green-600">Optimal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Backup</span>
                      <span className="font-medium text-gray-900">2 hours ago</span>
                    </div>
                  </div>
                </div>

                {/* Satellite Service */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">Satellite Service</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">API Status</span>
                      <span className="font-medium text-green-600">Operational</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Sync</span>
                      <span className="font-medium text-gray-900">12 minutes ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Images Downloaded</span>
                      <span className="font-medium text-gray-900">47 (Today)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Processing Queue</span>
                      <span className="font-medium text-gray-900">3 pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
