import { LogIn, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router';

export function QuickAccess() {
  const navigate = useNavigate();

  return (
    <section id="quick-access" className="w-full bg-gradient-to-br from-gray-50 to-teal-50 py-20">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-wider text-teal-700 uppercase">
            QUICK ACCESS
          </span>
          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Get Started with CSIDC GIS Portal
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Access the industrial land compliance monitoring system for authorized officials
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left - CSIDC Logo */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform border-4 border-white">
              <div className="text-center text-white p-8">
                <div className="text-7xl font-bold mb-3">CSIDC</div>
                <div className="text-lg tracking-wider font-semibold border-t-2 border-white/30 pt-3 mt-3">
                  Industrial Land
                </div>
                <div className="text-sm tracking-wide opacity-90 mt-1">
                  Compliance System
                </div>
              </div>
            </div>
          </div>

          {/* Right - Information blocks */}
          <div className="space-y-6">
            {/* GIS Login Portal block */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-100 hover:shadow-xl transition-all hover:border-teal-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 rounded-lg flex-shrink-0">
                  <LogIn className="w-6 h-6 text-teal-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">GIS Login Portal</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Secure authentication for CSIDC officials, field inspectors, and authorized government personnel to access the compliance monitoring dashboard.
                  </p>
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition-colors font-medium text-sm"
                  >
                    Login Now
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Access block */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-100 hover:shadow-xl transition-all hover:border-orange-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                  <LayoutDashboard className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Compliance Dashboard</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Access industrial area monitoring, plot compliance tracking, encroachment detection, change analysis, and comprehensive reporting tools.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
              <h4 className="font-bold text-lg mb-3">Key Features:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Real-time satellite monitoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Automated compliance alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Encroachment detection system
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Field verification workflows
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}