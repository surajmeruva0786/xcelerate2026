import { ArrowRight, Building2, AlertTriangle, Radar, ClipboardCheck, MapPin, CheckCircle, TrendingUp, FileText, Bell } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';

const moduleData = [
  {
    name: 'Industrial Areas Management',
    icon: Building2,
    color: 'from-blue-500 to-indigo-600',
    description: 'Comprehensive mapping and monitoring of all CSIDC industrial zones, plot allocation tracking, and infrastructure management across Chhattisgarh.',
    image: 'https://images.unsplash.com/photo-1759722128477-322b56a9e426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwYnVpbGRpbmclMjBjb21wbGV4JTIwYXJjaGl0ZWN0dXJlJTIwbW9kZXJufGVufDF8fHx8MTc3MDk5MDQ0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    link: '/dashboard/areas',
  },
  {
    name: 'Plot Compliance Monitoring',
    icon: ClipboardCheck,
    color: 'from-green-500 to-emerald-600',
    description: 'Real-time compliance tracking for industrial plots, automated alerts for violations, land use verification, and regulatory adherence monitoring.',
    image: 'https://images.unsplash.com/photo-1682663810771-89d21838530f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJ2ZXlvciUyMG1lYXN1cmluZyUyMGxhbmQlMjBjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc3MDk5MDQ0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    link: '/dashboard/plots',
  },
  {
    name: 'Encroachment Detection',
    icon: AlertTriangle,
    color: 'from-red-500 to-pink-600',
    description: 'Advanced satellite-based encroachment detection, unauthorized construction identification, boundary violation alerts, and rapid response management.',
    image: 'https://images.unsplash.com/photo-1769629918261-92d1fac176cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbmclMjBleGNhdmF0b3IlMjBxdWFycnklMjBvcGVyYXRpb25zfGVufDF8fHx8MTc3MDk5MDQ0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    link: '/dashboard/encroachments',
  },
  {
    name: 'Change Detection Analysis',
    icon: Radar,
    color: 'from-purple-500 to-violet-600',
    description: 'Multi-temporal satellite imagery analysis, before/after comparison, built-up area change tracking, and automated anomaly detection system.',
    image: 'https://images.unsplash.com/photo-1759479344409-84d6f9d1f578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYWVyaWFsJTIwdmlldyUyMHVyYmFuJTIwZGV2ZWxvcG1lbnQlMjBuaWdodHxlbnwxfHx8fDE3NzA5OTA0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    link: '/dashboard/change-detection',
  },
  {
    name: 'Verification Workflow',
    icon: MapPin,
    color: 'from-orange-500 to-amber-600',
    description: 'Field verification management, ground-truthing workflows, inspector assignment, photographic evidence collection, and approval tracking.',
    image: 'https://images.unsplash.com/photo-1760161306014-e2dcc13cbdf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjBzYWZldHklMjB2ZXN0JTIwaW5zcGVjdGlvbnxlbnwxfHx8fDE3NzA5OTA0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    link: '/dashboard/verification',
  },
];

export function Departments() {
  const navigate = useNavigate();

  const departments = [
    {
      title: 'Plot Compliance',
      description: 'Monitor adherence to approved land use plans and building regulations across all industrial plots.',
      icon: CheckCircle,
      color: 'blue',
    },
    {
      title: 'Encroachment Detection',
      description: 'Automated identification of unauthorized constructions and boundary violations using satellite imagery.',
      icon: AlertTriangle,
      color: 'orange',
    },
    {
      title: 'Change Analysis',
      description: 'Track and analyze temporal changes in land use patterns and construction activities over time.',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Field Verification',
      description: 'Coordinate ground truth inspections and maintain verification workflows for compliance issues.',
      icon: MapPin,
      color: 'purple',
    },
    {
      title: 'Report Generation',
      description: 'Generate comprehensive compliance reports with GIS data and photographic evidence for authorities.',
      icon: FileText,
      color: 'red',
    },
    {
      title: 'Alert Management',
      description: 'Configure automated alerts for compliance violations and manage notification workflows.',
      icon: Bell,
      color: 'yellow',
    },
  ];

  return (
    <section id="departments" className="w-full bg-white py-20 border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-semibold tracking-wider text-teal-700 uppercase">
            SYSTEM MODULES
          </span>
          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Industrial Land Compliance Features
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive GIS-based monitoring solutions for industrial plot management, compliance tracking, and automated detection systems.
          </p>
        </div>

        {/* Module cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {moduleData.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-105 cursor-pointer"
                onClick={() => navigate(module.link)}
              >
                {/* Image header */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={module.image}
                    alt={module.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-60`}></div>
                  <div className="absolute top-4 left-4 p-3 bg-white rounded-lg shadow-lg">
                    <Icon className="w-6 h-6 text-teal-700" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">
                    {module.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {module.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}