import { Lightbulb, AlertTriangle, CheckCircle, Activity, TrendingUp, FileText } from 'lucide-react';

interface DashboardInsights {
    executive_summary?: string;
    key_findings?: string[];
    recommendations?: string[];
    compliance_status?: string;
    risk_level?: string;
    construction_trend?: string;
    comparative_findings?: {
        category: string;
        manual_plan: string;
        satellite_analysis: string;
        ground_reality: string;
        discrepancy: string;
        action: string;
    }[];
}

interface LLMInsightPanelProps {
    insights?: DashboardInsights;
    groqAnalysis?: {
        encroachment_status?: string;
        construction_percentage?: number;
        vegetation_percentage?: number;
        idle_status?: string;
        explanation?: string;
    };
    zone?: string;
}

export function LLMInsightPanel({ insights, groqAnalysis, zone }: LLMInsightPanelProps) {
    if (!insights && !groqAnalysis) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center">
                    <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No AI Insights Available</h3>
                    <p className="text-sm text-gray-600">
                        Run an analysis to generate AI-powered insights and recommendations
                    </p>
                </div>
            </div>
        );
    }

    const getRiskColor = (risk?: string) => {
        switch (risk?.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'medium':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getComplianceColor = (status?: string) => {
        if (status?.toLowerCase().includes('compliant')) {
            return 'bg-green-100 text-green-800 border-green-300';
        } else if (status?.toLowerCase().includes('review')) {
            return 'bg-orange-100 text-orange-800 border-orange-300';
        } else {
            return 'bg-red-100 text-red-800 border-red-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Executive Summary */}
            {insights?.executive_summary && (
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg shadow-md p-6 border border-teal-200">
                    <div className="flex items-start gap-3">
                        <FileText className="w-6 h-6 text-teal-700 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Summary</h3>
                            <p className="text-gray-700 leading-relaxed">{insights.executive_summary}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights?.compliance_status && (
                    <div className={`rounded-lg p-4 border-2 ${getComplianceColor(insights.compliance_status)}`}>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <div>
                                <p className="text-xs font-medium opacity-75">Compliance Status</p>
                                <p className="text-sm font-bold mt-0.5">{insights.compliance_status}</p>
                            </div>
                        </div>
                    </div>
                )}

                {insights?.risk_level && (
                    <div className={`rounded-lg p-4 border-2 ${getRiskColor(insights.risk_level)}`}>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            <div>
                                <p className="text-xs font-medium opacity-75">Risk Level</p>
                                <p className="text-sm font-bold mt-0.5">{insights.risk_level}</p>
                            </div>
                        </div>
                    </div>
                )}

                {insights?.construction_trend && (
                    <div className="rounded-lg p-4 border-2 bg-blue-100 text-blue-800 border-blue-300">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            <div>
                                <p className="text-xs font-medium opacity-75">Construction Trend</p>
                                <p className="text-sm font-bold mt-0.5">{insights.construction_trend}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Vision Analysis Stats */}
            {groqAnalysis && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-teal-700" />
                        <h3 className="text-lg font-semibold text-gray-900">AI Vision Analysis</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Construction Coverage</p>
                            <p className="text-2xl font-bold text-gray-900">{groqAnalysis.construction_percentage || 0}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Vegetation Coverage</p>
                            <p className="text-2xl font-bold text-green-700">{groqAnalysis.vegetation_percentage || 0}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                            <p className="text-xs text-gray-600 mb-1">Activity Status</p>
                            <p className="text-lg font-semibold text-gray-900">{groqAnalysis.idle_status || 'Unknown'}</p>
                        </div>
                    </div>

                    {groqAnalysis.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-700 leading-relaxed">{groqAnalysis.explanation}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Key Findings */}
            {insights?.key_findings && insights.key_findings.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Key Findings</h3>
                    </div>
                    <ul className="space-y-3">
                        {insights.key_findings.map((finding, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-semibold">
                                    {index + 1}
                                </span>
                                <p className="text-sm text-gray-700 leading-relaxed mt-0.5">{finding}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recommendations */}
            {insights?.recommendations && insights.recommendations.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
                    </div>
                    <ul className="space-y-3">
                        {insights.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Comparative Findings Table */}
            {insights?.comparative_findings && insights.comparative_findings.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-700" />
                            <h3 className="text-lg font-semibold text-gray-900">Summary of Comparative Findings</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Category</th>
                                    <th className="px-6 py-3 font-semibold">Manual Plan (Initial State)</th>
                                    <th className="px-6 py-3 font-semibold">Satellite/AI Analysis</th>
                                    <th className="px-6 py-3 font-semibold">Ground Reality (Inferred)</th>
                                    <th className="px-6 py-3 font-semibold">Discrepancy/Alignment</th>
                                    <th className="px-6 py-3 font-semibold">Recommended Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {insights.comparative_findings.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.category}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.manual_plan}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.satellite_analysis}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.ground_reality}</td>
                                        <td className={`px-6 py-4 font-medium ${item.discrepancy?.includes('Mary') || item.discrepancy?.includes('Major') ? 'text-red-600' : item.discrepancy?.includes('New') ? 'text-green-600' : 'text-gray-900'
                                            }`}>
                                            {item.discrepancy}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{item.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
