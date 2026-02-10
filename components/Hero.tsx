
import React from 'react';
import { ProfileData } from '../types.ts';

interface HeroProps {
  data: ProfileData;
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
  const nameParts = data.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-10 md:pt-0">
      {/* Background Ambience */}
      <div className="absolute inset-0 executive-gradient opacity-40"></div>
      
      {/* Luzes de fundo para profundidade */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-[100vw] xl:max-w-7xl mx-auto px-0 md:px-4 flex flex-col items-center">
        
        {/* Content Container */}
        <div className="relative w-full flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-12 transition-all duration-700">
          
          {/* Executive Portrait Area */}
          <div className="relative group shrink-0 z-20">
            <div className="relative w-72 h-[450px] md:w-[400px] md:h-[600px] lg:w-[450px] lg:h-[700px] overflow-hidden rounded-sm border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-slate-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-70"></div>
              
              <img 
                src="https://i.postimg.cc/j2CfZFjd/heder-profile-jpg.png" 
                alt={`${data.name} - Perfil Executivo`}
                onError={(e) => {
                  // Fallback caso o link externo falhe
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop";
                }}
                className="w-full h-full object-cover grayscale opacity-95 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              
              <div className="absolute bottom-6 left-6 z-20">
                <p className="text-[8px] uppercase tracking-[0.6em] text-white/50 font-cinzel font-bold">PROTOCOL HS-01</p>
              </div>
            </div>
          </div>

          {/* Monumental Name Area */}
          <div className="relative flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0 z-10">
            <div className="flex flex-col leading-none">
              <h1 className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] xl:text-[15rem] font-bold tracking-tighter text-white uppercase italic font-serif leading-[0.7] drop-shadow-[0_20px_40px_rgba(0,0,0,1)]">
                {firstName}
              </h1>
              <h1 className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] xl:text-[15rem] font-bold tracking-tighter text-white uppercase italic font-serif leading-[0.7] drop-shadow-[0_20px_40px_rgba(0,0,0,1)]">
                {lastName}
              </h1>
            </div>

            {/* Subtitle */}
            <div className="mt-12 lg:mt-8 w-full max-w-2xl">
              <div className="h-px w-24 bg-blue-500 mb-6 mx-auto lg:mx-0 opacity-80 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              <div className="text-[10px] md:text-sm lg:text-base text-blue-400 font-cinzel tracking-[0.7em] uppercase font-bold drop-shadow-sm">
                {data.title}
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 opacity-30 hover:opacity-100 transition-all duration-500 cursor-pointer group" onClick={() => document.getElementById('sobre-mim')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="text-[8px] uppercase tracking-[0.8em] font-cinzel font-bold text-slate-500 group-hover:text-blue-400">Descobrir</span>
          <div className="w-px h-16 bg-gradient-to-b from-blue-500 to-transparent group-hover:h-20 transition-all duration-700"></div>
        </div>
      </div>
    </div>
  );
};
