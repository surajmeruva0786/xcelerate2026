import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section id="main" className="w-full relative overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://cggis.cgstate.gov.in/geocg/static/media/hero-video-2.f00e055208cdab89a7f1.webm" type="video/webm" />
        </video>
        {/* Enhanced dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-teal-900/60 to-slate-900/70"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Text */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="text-sm font-semibold tracking-wider text-white uppercase bg-teal-600/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-teal-400/30 shadow-lg">
                Chhattisgarh State
              </span>
            </div>

            <h1 className="text-7xl font-bold text-white leading-tight drop-shadow-2xl">
              Geospatial Portal
            </h1>

            <p className="text-xl text-gray-100 max-w-xl leading-relaxed drop-shadow-lg">
              Access interactive maps, GIS data, and decision-support analytics across all 33 districts.
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-4 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all hover:shadow-2xl hover:scale-105 font-semibold text-lg shadow-xl"
              >
                GIS Login
              </button>
            </div>

            {/* Quick stats */}
            <div className="pt-8 grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <p className="text-3xl font-bold text-white">33</p>
                <p className="text-sm text-gray-200 mt-1">Districts</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <p className="text-3xl font-bold text-white">1,247+</p>
                <p className="text-sm text-gray-200 mt-1">Plots</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <p className="text-3xl font-bold text-white">98.4%</p>
                <p className="text-sm text-gray-200 mt-1">Compliance</p>
              </div>
            </div>
          </div>

          {/* Right column - Map illustration */}
          <div className="relative">
            {/* Image Collage Grid */}
            <div className="relative w-full h-[505px]">
              {/* Image 1 - Top Right Large */}
              <div 
                className="absolute rounded-lg overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105 hover:shadow-2xl hover:z-20"
                style={{ 
                  width: '45%', 
                  height: '41%', 
                  left: '55%', 
                  top: '0%',
                  transitionDelay: '0.1s'
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1769240627842-1a3bd858695c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbmclMjBleGNhdmF0b3IlMjBpbmR1c3RyaWFsJTIwc2l0ZXxlbnwxfHx8fDE3NzA5MTg3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Mining Operations"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Image 2 - Bottom Right */}
              <div 
                className="absolute rounded-lg overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105 hover:shadow-2xl hover:z-20"
                style={{ 
                  width: '45%', 
                  height: '57%', 
                  left: '55%', 
                  top: '42%',
                  transitionDelay: '0.2s'
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1764856601179-dfeca7b37e4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwd29ya2VycyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzA5OTMzNzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Construction Site"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Image 3 - Middle Bottom */}
              <div 
                className="absolute rounded-lg overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105 hover:shadow-2xl hover:z-20"
                style={{ 
                  width: '29%', 
                  height: '29%', 
                  left: '25%', 
                  top: '61%',
                  transitionDelay: '0.3s'
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1769700002268-0f12bf48bc44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZmFjdG9yeSUyMGNvbXBsZXglMjBhZXJpYWx8ZW58MXx8fHwxNzcwOTkzMzcxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Industrial Complex"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Image 4 - Left Small */}
              <div 
                className="absolute rounded-lg overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105 hover:shadow-2xl hover:z-20"
                style={{ 
                  width: '18%', 
                  height: '29%', 
                  left: '6.5%', 
                  top: '17%',
                  transitionDelay: '0.4s'
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1770822662903-aa69f6aa9b03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJ2ZXlpbmclMjBlcXVpcG1lbnQlMjBsYW5kJTIwbWVhc3VyZW1lbnR8ZW58MXx8fHwxNzcwOTkzMzcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Surveying Equipment"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Image 5 - Middle Center Tall */}
              <div 
                className="absolute rounded-lg overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105 hover:shadow-2xl hover:z-20"
                style={{ 
                  width: '29%', 
                  height: '54%', 
                  left: '25%', 
                  top: '5%',
                  transitionDelay: '0.5s'
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1642112539042-d943a8f2503b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGFyayUyMGluZnJhc3RydWN0dXJlJTIwcm9hZHxlbnwxfHx8fDE3NzA5OTMzNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Industrial Park"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Image 6 - Left Bottom Small */}
              <div 
                className="absolute rounded-lg overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105 hover:shadow-2xl hover:z-20"
                style={{ 
                  width: '14.5%', 
                  height: '17%', 
                  left: '9.7%', 
                  top: '47%',
                  transitionDelay: '0.6s'
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1686945127170-ae15deda7bcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbmclMjBxdWFycnklMjBvcGVyYXRpb25zJTIwbmlnaHR8ZW58MXx8fHwxNzcwOTkzMzcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Quarry Operations"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Image 7 - Bottom Left Wide */}
              <div 
                className="absolute rounded-lg overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105 hover:shadow-2xl hover:z-20"
                style={{ 
                  width: '24%', 
                  height: '17%', 
                  left: '0%', 
                  top: '65.5%',
                  transitionDelay: '0.7s'
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1682063631532-b865521538fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWVsZCUyMGluc3BlY3Rpb24lMjB3b3JrZXIlMjBzYWZldHklMjBnZWFyfGVufDF8fHx8MTc3MDk5MzM3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Field Inspection"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-teal-600 text-white rounded-2xl p-6 shadow-2xl border-4 border-white z-30">
              <p className="text-4xl font-bold">2.00</p>
              <p className="text-sm mt-1 opacity-90">Lakh sq km</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}