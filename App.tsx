
import React, { useState, useEffect } from 'react';
import { PROFILE_DATA } from './constants.tsx';
import { Hero } from './components/Hero.tsx';
import { Header } from './components/Header.tsx';
import { About } from './components/About.tsx';
import { ExperienceSection } from './components/Experience.tsx';
import { SkillsSection } from './components/Skills.tsx';
import { ContactSection } from './components/Contact.tsx';
import { GeminiAssistant } from './components/GeminiAssistant.tsx';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sectionIds = ['home', 'sobre-mim', 'experiencia', 'competencias', 'contato'];
    
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <Header activeSection={activeSection} />
      
      <main>
        <section id="home">
          <Hero data={PROFILE_DATA} />
        </section>

        <section id="sobre-mim" className="pt-2 pb-16 relative">
          <About data={PROFILE_DATA} />
        </section>

        <section id="experiencia" className="py-16">
          <ExperienceSection experiences={PROFILE_DATA.experiences} />
        </section>

        <section id="competencias" className="py-16 relative">
          <div className="absolute inset-0 executive-gradient opacity-20 -z-10"></div>
          <SkillsSection skills={PROFILE_DATA.skills} />
        </section>

        <section id="contato" className="py-16">
          <ContactSection contact={PROFILE_DATA.contact} />
        </section>
      </main>

      <footer className="pb-16 px-6">
        <div className="max-w-5xl mx-auto glass-panel p-12 rounded-sm text-center">
          <div className="text-2xl font-bold tracking-[0.5em] text-white mb-6 uppercase font-cinzel">
            Heder Santos
          </div>
          <div className="w-12 h-px bg-blue-500 mx-auto mb-6 opacity-50"></div>
          <p className="text-slate-400 text-[10px] tracking-[0.4em] uppercase mb-4 font-cinzel">
            &copy; {new Date().getFullYear()} Excelência em Gestão Estratégica
          </p>
          <p className="text-slate-500 font-light italic text-sm max-w-lg mx-auto leading-relaxed mb-8 font-serif">
            "A conquista do futuro só se dá pelo excelente trabalho do presente, usando a matéria-prima do passado."
          </p>
          <div className="pt-8 border-t border-white/5">
            <p className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-cinzel">
              Brasília • Brasil • Portfólio Executivo
            </p>
          </div>
        </div>
      </footer>

      <GeminiAssistant profile={PROFILE_DATA} />
    </div>
  );
};

export default App;
