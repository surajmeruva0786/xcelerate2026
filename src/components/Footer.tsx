import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Left column - Logo and description */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold">
                CHiPS
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Chhattisgarh Center of Geo-Informatics</h3>
                <p className="text-sm text-gray-400">Chhattisgarh Infotech Promotion Society (CHiPS)</p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed max-w-2xl">
              State Spatial Data Infrastructure & GIS Monitoring Portal for Chhattisgarh. 
              Empowering data-driven governance and sustainable development.
            </p>

            {/* Social media icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right column - Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Quick Links</h4>
            <nav className="space-y-3">
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">
                Home
              </a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">
                About us
              </a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">
                Departments
              </a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">
                Contact
              </a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">
                GIS Login
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom legal section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-gray-400">
                © {currentYear} - Copyright Chhattisgarh State Geo Portals. All rights reserved. 
                <span className="text-teal-400"> Powered by CHiPS</span>
              </p>
              <p className="text-gray-500 text-xs">
                Content Owned, Maintained and Updated by CHiPS | Best viewed in Chrome, Firefox, Edge browsers
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                Sitemap
              </a>
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">Last Updated: 12 February 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
