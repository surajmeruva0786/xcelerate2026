import { ArrowRight } from 'lucide-react';

export function CTABand() {
  return (
    <section id="contact" className="w-full bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 py-16">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Text content */}
          <div className="text-white space-y-3 text-center lg:text-left">
            <h2 className="text-3xl font-bold">Ready to explore?</h2>
            <p className="text-xl text-teal-50">
              Access Chhattisgarh State Geo Portals today.
            </p>
            <p className="text-teal-100 max-w-2xl">
              Join citizens, researchers, and government officials in accessing comprehensive geospatial data and services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}