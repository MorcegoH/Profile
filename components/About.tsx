
import React from 'react';
import { ProfileData } from '../types';

export const About: React.FC<AboutProps> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 relative z-10">
      <div className="mb-12 md:mb-16 flex items-center space-x-4 md:space-x-6">
        <span className="text-5xl md:text-8xl font-cinzel text-white/5 font-bold leading-none select-none">II</span>
        <div className="flex flex-col">
          <h3 className="text-[18px] md:text-2xl font-bold tracking-[0.2em] text-blue-500 font-cinzel">II</h3>
          <div className="h-px w-full bg-gradient-to-r from-blue-500/50 to-transparent mt-1"></div>
          <p className="text-xl md:text-4xl font-serif italic text-white mt-2 tracking-tight opacity-80">Sobre Mim</p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 md:gap-16">
        <div className="md:col-span-8 order-2 md:order-1">
          <div className="relative">
            <div className="hidden md:block absolute -left-10 top-0 h-full w-px bg-gradient-to-b from-blue-500/30 via-purple-500/20 to-transparent"></div>
            <div className="text-base md:text-2xl leading-[1.6] md:leading-[1.8] text-slate-200 font-light text-justify font-serif italic first-letter:text-6xl md:first-letter:text-8xl first-letter:font-bold first-letter:text-blue-500 first-letter:mr-3 md:first-letter:mr-4 first-letter:float-left first-letter:mt-1 md:first-letter:mt-2 whitespace-pre-line">
              {data.bio}
            </div>
            
            <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
              {[
                { label: "Experiência", val: "15+ ANOS" },
                { label: "Jurisdição", val: "NACIONAL" },
                { label: "Foco Principal", val: "ESTRATÉGIA & IA" }
              ].map((item, i) => (
                <div key={i} className="group cursor-default border-l border-white/10 pl-4 transition-all hover:border-blue-500/50">
                  <p className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-[0.4em] mb-2 group-hover:text-blue-400 transition-colors font-cinzel font-bold">{item.label}</p>
                  <p className="text-xs md:text-sm font-bold text-white tracking-widest uppercase font-cinzel">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-8 md:space-y-12 order-1 md:order-2">
          <div className="glass-panel p-6 md:p-10 rounded-sm border-l-4 border-blue-500/50">
            <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-white/40 mb-6 font-bold font-cinzel border-b border-white/5 pb-2">Acadêmico</h4>
            <div className="space-y-8 md:space-y-10">
              {data.education.map((edu, idx) => (
                <div key={idx} className="relative group">
                  <p className="text-[9px] md:text-[10px] text-blue-500/60 mb-2 font-cinzel italic tracking-widest font-bold">{edu.year}</p>
                  <p className="text-sm md:text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors uppercase tracking-tight font-serif italic leading-tight">{edu.degree}</p>
                  <p className="text-[10px] md:text-[11px] text-slate-500 font-cinzel tracking-wider uppercase">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 md:p-8 border-r-2 border-purple-500/20 bg-white/[0.01] italic text-xs md:text-base text-slate-400 leading-relaxed font-serif text-right rounded-sm">
            "Sem dados, não há direção. Sem direção, não há objetivos. A governança utiliza a informação para pavimentar o caminho rumo à visão, com eficiência e consistência absoluta."
          </div>
        </div>
      </div>
    </div>
  );
};

interface AboutProps {
  data: ProfileData;
}
