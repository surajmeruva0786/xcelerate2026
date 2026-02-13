import { Building2, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const cards = [
  {
    title: 'Total Plots',
    value: '1,247',
    icon: Building2,
    color: 'bg-blue-50 text-blue-600',
    trend: null,
  },
  {
    title: 'Running Units',
    value: '892',
    percentage: '71.5%',
    icon: CheckCircle,
    color: 'bg-green-50 text-green-600',
    trend: '+2.3%',
    trendUp: true,
  },
  {
    title: 'Closed Units',
    value: '355',
    percentage: '28.5%',
    icon: XCircle,
    color: 'bg-gray-50 text-gray-600',
    trend: '-1.2%',
    trendUp: false,
  },
  {
    title: 'Encroached Plots',
    value: '47',
    percentage: '3.8%',
    icon: AlertTriangle,
    color: 'bg-orange-50 text-orange-600',
    trend: '+5 new',
    trendUp: false,
  },
  {
    title: 'High Risk Plots',
    value: '23',
    percentage: '1.8%',
    icon: TrendingUp,
    color: 'bg-red-50 text-red-600',
    trend: 'Requires action',
    trendUp: false,
  },
];

export function ComplianceSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                {card.percentage && (
                  <span className="text-sm text-gray-500">{card.percentage}</span>
                )}
              </div>
              {card.trend && (
                <p className={`text-xs mt-2 ${card.trendUp ? 'text-green-600' : 'text-orange-600'}`}>
                  {card.trend}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
