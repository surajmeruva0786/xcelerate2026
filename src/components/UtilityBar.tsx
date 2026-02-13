import { Flag } from 'lucide-react';

export function UtilityBar() {
  return (
    <div className="w-full bg-gray-50 border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-6 py-2">
        <div className="flex items-center justify-between text-xs">
          {/* Left side */}
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-orange-500" />
            <a href="#" className="text-gray-700 hover:text-teal-700 font-medium">
              CG Gov
            </a>
          </div>

          {/* Center and right side */}
          <div className="flex items-center gap-6">
            <a href="#main" className="text-gray-600 hover:text-teal-700 underline">
              Skip to Main Content
            </a>
            
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Font Size:</span>
              <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded">A-</button>
              <button className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded font-medium">A</button>
              <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded">A+</button>
            </div>

            <button className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded font-medium">
              हिंदी
            </button>

            <button className="text-gray-600 hover:text-teal-700">More</button>
          </div>
        </div>
      </div>
    </div>
  );
}
