import { Satellite, Shield } from 'lucide-react';

export function LeaderCards() {
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16 border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8">
          {/* Real-time Satellite Monitoring Feature */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border-2 border-teal-100 p-8 flex items-center gap-6 w-full sm:w-auto hover:scale-105 duration-300">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-teal-500 flex-shrink-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                <Satellite className="w-12 h-12 text-teal-600" />
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-xl border-2 border-teal-300 animate-ping opacity-20"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Real-time Satellite Monitoring</h3>
              <p className="text-sm text-gray-600 font-medium">Advanced geospatial tracking system</p>
              <div className="mt-2 inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
                Core Technology
              </div>
            </div>
          </div>

          {/* Automated Compliance Detection Feature */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border-2 border-blue-100 p-8 flex items-center gap-6 w-full sm:w-auto hover:scale-105 duration-300">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-blue-600 flex-shrink-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-xl border-2 border-blue-300 animate-ping opacity-20"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Automated Compliance Detection</h3>
              <p className="text-sm text-gray-600 font-medium">AI-powered encroachment alerts</p>
              <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                Smart Analytics
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}