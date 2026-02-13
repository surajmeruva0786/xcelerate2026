import { ComplianceSummaryCards } from '../../components/dashboard/ComplianceSummaryCards';
import { RiskDistributionChart } from '../../components/dashboard/RiskDistributionChart';
import { BuiltUpChangeChart } from '../../components/dashboard/BuiltUpChangeChart';
import { MapPreview } from '../../components/dashboard/MapPreview';
import { RecentAlertsTable } from '../../components/dashboard/RecentAlertsTable';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Compliance Overview</h2>
        <p className="text-sm text-gray-600 mt-1">Real-time monitoring and analytics dashboard</p>
      </div>

      {/* Summary Cards */}
      <ComplianceSummaryCards />

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RiskDistributionChart />
        <BuiltUpChangeChart />
      </div>

      {/* Map and Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <MapPreview />
        <RecentAlertsTable />
      </div>
    </div>
  );
}
