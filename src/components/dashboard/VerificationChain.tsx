import { useState } from 'react';
import { Shield, CheckCircle, UserCheck, CheckSquare } from 'lucide-react';

export function VerificationChain() {
    const [steps, setSteps] = useState({
        drone: false,
        fieldOfficer: false,
        official: false
    });

    const handleDroneCheck = () => {
        setSteps(prev => ({ ...prev, drone: !prev.drone, fieldOfficer: false, official: false }));
    };

    const handleFieldOfficerCheck = () => {
        if (steps.drone) {
            setSteps(prev => ({ ...prev, fieldOfficer: !prev.fieldOfficer, official: false }));
        }
    };

    const handleOfficialCheck = () => {
        if (steps.drone && steps.fieldOfficer) {
            setSteps(prev => ({ ...prev, official: !prev.official }));
        }
    };

    return (
        <div className="mt-8 bg-white border-t border-gray-200 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-teal-700" />
                    <h3 className="text-lg font-semibold text-gray-900">Verification Protocol</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

                    {/* Step 1: Drone Verification */}
                    <div className={`relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${steps.drone ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'
                        }`}>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${steps.drone ? 'bg-teal-100 text-teal-700 border-white' : 'bg-gray-100 text-gray-400 border-white'
                            }`}>
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h4 className="font-semibold text-gray-900">Level 1: Drone</h4>
                            <p className="text-xs text-gray-500 mt-1">Automated aerial survey confirmation</p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer mt-2 px-3 py-1.5 rounded hover:bg-black/5 transition-colors">
                            <input
                                type="checkbox"
                                checked={steps.drone}
                                onChange={handleDroneCheck}
                                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-700">Verify</span>
                        </label>
                    </div>

                    {/* Step 2: Field Officer Verification */}
                    <div className={`relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${steps.fieldOfficer ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                        } ${!steps.drone ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${steps.fieldOfficer ? 'bg-blue-100 text-blue-700 border-white' : 'bg-gray-100 text-gray-400 border-white'
                            }`}>
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h4 className="font-semibold text-gray-900">Level 2: Field Officer</h4>
                            <p className="text-xs text-gray-500 mt-1">Ground truth validation</p>
                        </div>
                        <label className={`flex items-center gap-2 mt-2 px-3 py-1.5 rounded transition-colors ${!steps.drone ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-black/5'}`}>
                            <input
                                type="checkbox"
                                checked={steps.fieldOfficer}
                                onChange={handleFieldOfficerCheck}
                                disabled={!steps.drone}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                            />
                            <span className="text-sm font-medium text-gray-700">Verify</span>
                        </label>
                    </div>

                    {/* Step 3: Official Verification */}
                    <div className={`relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${steps.official ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'
                        } ${!steps.fieldOfficer ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${steps.official ? 'bg-purple-100 text-purple-700 border-white' : 'bg-gray-100 text-gray-400 border-white'
                            }`}>
                            <CheckSquare className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h4 className="font-semibold text-gray-900">Level 3: Official</h4>
                            <p className="text-xs text-gray-500 mt-1">Final dataset approval</p>
                        </div>
                        <label className={`flex items-center gap-2 mt-2 px-3 py-1.5 rounded transition-colors ${!steps.fieldOfficer ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-black/5'}`}>
                            <input
                                type="checkbox"
                                checked={steps.official}
                                onChange={handleOfficialCheck}
                                disabled={!steps.fieldOfficer}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300 disabled:opacity-50"
                            />
                            <span className="text-sm font-medium text-gray-700">Approve</span>
                        </label>
                    </div>

                </div>
            </div>
        </div>
    );
}
