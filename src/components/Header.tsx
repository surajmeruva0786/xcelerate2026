import { Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import logoImage from 'figma:asset/98ab16617d450550db7b1676d9ccdfa8ed6dbec9.png';

export function Header() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="sticky top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-[1440px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 flex items-center justify-center bg-white rounded overflow-hidden shadow-sm p-0.5">
              <img 
                src={logoImage} 
                alt="JRTN Team Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">JAATHIRATNALU</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-900 font-medium border-b-2 border-teal-700 pb-1"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('quick-access')}
              className="text-gray-600 hover:text-teal-700 font-medium"
            >
              About us
            </button>
            <button 
              onClick={() => scrollToSection('departments')}
              className="text-gray-600 hover:text-teal-700 font-medium"
            >
              Departments
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-600 hover:text-teal-700 font-medium"
            >
              Contact
            </button>
          </nav>

          {/* Search and Login */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search the website"
                className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition-colors font-medium text-sm whitespace-nowrap"
            >
              GIS Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}