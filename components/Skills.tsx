
import React from 'react';
import { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="mb-8 md:mb-16 text-center">
        <span className="section-number">IV</span>
        <h3 className="text-2xl md:text-5xl font-bold tracking-tight text-white italic font-serif">Domínios de Competência</h3>
        <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-3 md:mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 glass-panel overflow-hidden rounded-sm">
        {skills.map((skill, idx) => (
          <div key={idx} className={`p-6 md:p-10 ${idx !== 2 ? 'md:border-r border-white/10' : ''} ${idx !== 0 ? 'border-t md:border-t-0 border-white/10' : ''} group hover:bg-white/[0.02] transition-colors`}>
            <div className="flex items-center mb-6 md:mb-10">
              <span className="text-[9px] font-cinzel text-blue-500 mr-3">0{idx+1}</span>
              <h4 className="text-white text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold font-cinzel group-hover:text-blue-400 transition-colors">
                {skill.category}
              </h4>
            </div>
            <ul className="space-y-4 md:space-y-6">
              {skill.items.map((item, i) => (
                <li key={i} className="flex flex-col group/item cursor-default">
                  <span className="text-sm md:text-base font-light text-slate-300 group-hover/item:text-white transition-colors font-serif italic tracking-wide">
                    {item}
                  </span>
                  <div className="w-3 group-hover/item:w-full h-px bg-blue-500/30 transition-all duration-700 mt-1"></div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-8 md:mt-16 flex flex-wrap justify-center gap-x-6 md:gap-x-12 gap-y-3 md:gap-y-6 opacity-30 group cursor-default">
        {["Governança de Dados", "Ética Corporativa", "Resiliência Operacional", "Liderança Sistêmica"].map((text, i) => (
          <span key={i} className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] italic font-cinzel hover:text-white transition-colors hover:opacity-100">{text}</span>
        ))}
      </div>
    </div>
  );
};
