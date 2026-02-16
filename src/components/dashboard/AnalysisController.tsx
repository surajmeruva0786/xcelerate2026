import { useState } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

const ZONES = [
    'Bhanpuri',
    'Birkoni',
    'Amaseoni',
    'Borai',
    'Electronic EMC',
    'Gogoan',
    'Gondwara',
    'Harinchhapara',
    'Kapan',
    'Nayanpur-Gibarganj',
    'Ranidurgawati Anjani',
    'Rawabhata',
    'Siltara Phase 1',
    'Siltara Phase 2',
    'Sirgitti',
    'Sondongari',
    'Tendua Phase 1',
    'Tendua Phase 2',
    'Tifra',
    'Urla'
];

interface AnalysisControllerProps {
    onAnalysisStart?: () => void;
    onAnalysisComplete?: (data: any) => void;
    onAnalysisError?: (error: string) => void;
}

export function AnalysisController({
    onAnalysisStart,
    onAnalysisComplete,
    onAnalysisError
}: AnalysisControllerProps) {
    const [selectedZone, setSelectedZone] = useState(ZONES[0]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastAnalysis, setLastAnalysis] = useState<any>(null);

    const runAnalysis = async () => {
        setIsAnalyzing(true);
        setError(null);

        if (onAnalysisStart) {
            onAnalysisStart();
        }

        try {
            const response = await fetch(`${API_URL}/api/run-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ zone: selectedZone }),
            });

            if (!response.ok) {
                throw new Error(`Analysis failed: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'error') {
                throw new Error(data.error || 'Unknown error occurred');
            }

            // Save to localStorage
            localStorage.setItem('analysisResults', JSON.stringify(data));
            setLastAnalysis(data);

            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('analysisComplete', { detail: data }));

            if (onAnalysisComplete) {
                onAnalysisComplete(data);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to run analysis';
            setError(errorMessage);

            if (onAnalysisError) {
                onAnalysisError(errorMessage);
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Run Analysis</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Select an industrial zone and run encroachment detection
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Zone Selector */}
                <div>
                    <label htmlFor="zone-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Industrial Zone
                    </label>
                    <select
                        id="zone-select"
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        disabled={isAnalyzing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        {ZONES.map((zone) => (
                            <option key={zone} value={zone}>
                                {zone}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Run Button */}
                <button
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing {selectedZone}...
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5" />
                            Run Analysis
                        </>
                    )}
                </button>

                {/* Error Display */}
                {error && (
                    <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-900">Analysis Failed</p>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Last Analysis Info */}
                {lastAnalysis && !isAnalyzing && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-900">
                            Analysis Complete: {lastAnalysis.zone}
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                            {lastAnalysis.images ? Object.keys(lastAnalysis.images).filter(k => lastAnalysis.images[k]).length : 0} images generated
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
