
import React from 'react';
import { Experience } from '../types';

interface ExperienceProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceProps> = ({ experiences }) => {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="mb-12 flex items-center space-x-6">
        <span className="text-4xl md:text-6xl font-cinzel text-white/5 font-bold leading-none select-none">III</span>
        <div className="flex flex-col">
          <h3 className="text-[16px] md:text-xl font-bold tracking-[0.2em] text-purple-500 font-cinzel">III</h3>
          <div className="h-px w-full bg-gradient-to-r from-purple-500/50 to-transparent mt-1"></div>
          <p className="text-lg md:text-3xl font-serif italic text-white mt-1 tracking-tight opacity-80">Trajetória Profissional</p>
        </div>
      </div>

      <div className="space-y-0">
        {experiences.map((exp, idx) => (
          <div key={idx} className="group grid md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-12 border-b border-white/5 px-0">
            {/* Left Column: Period */}
            <div className="md:col-span-3">
              <span className="text-blue-500/80 font-serif italic text-sm md:text-base tracking-widest">{exp.period}</span>
            </div>

            {/* Right Column: Role, Company, Description & Achievements */}
            <div className="md:col-span-9">
              <div className="flex flex-col mb-6">
                <h4 className="text-xl md:text-3xl font-bold text-white group-hover:text-blue-200 transition-colors font-serif italic leading-tight">
                  {exp.role}
                </h4>
                <div className="mt-2">
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-purple-400/80 italic font-cinzel font-bold">
                    {exp.company}
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <p className="text-slate-300 font-light text-sm md:text-lg leading-relaxed font-serif text-justify italic opacity-90">
                  {exp.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {exp.achievements.map((ach, i) => (
                  <div key={i} className="flex items-start space-x-2 group/ach">
                    <span className="text-blue-500 text-[10px] mt-1 font-cinzel opacity-40">§</span>
                    <span className="text-[10px] md:text-xs text-slate-400 font-light leading-relaxed tracking-wider uppercase italic font-serif group-hover/ach:text-slate-200 transition-colors">
                      {ach}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
