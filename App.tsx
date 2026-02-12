
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
    const handleScroll = () => {
      const sections = ['home', 'sobre-mim', 'experiencia', 'competencias', 'contato'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-serif-elegant">
      <Header activeSection={activeSection} />
      <GeminiAssistant profile={PROFILE_DATA} />
      
      <main>
        <section id="home">
          <Hero data={PROFILE_DATA} />
        </section>

        <section id="sobre-mim" className="pt-2 pb-16 relative">
          <About data={PROFILE_DATA} />
        </section>

        <section id="experiencia" className="py-16 bg-black">
          <ExperienceSection experiences={PROFILE_DATA.experiences} />
        </section>

        <section id="competencias" className="py-16 relative">
          <div className="absolute inset-0 executive-gradient opacity-20 -z-10"></div>
          <SkillsSection skills={PROFILE_DATA.skills} />
        </section>

        <section id="contato" className="py-16 bg-black">
          <ContactSection contact={PROFILE_DATA.contact} />
        </section>
      </main>

      <footer className="pb-16 px-6">
        <div className="max-w-5xl mx-auto glass-panel p-12 rounded-2xl text-center">
          <div className="text-2xl font-bold tracking-[0.5em] text-white mb-6 uppercase">
            Heder Santos
          </div>
          <div className="w-12 h-px bg-blue-500 mx-auto mb-6 opacity-50"></div>
          <p className="text-slate-400 text-xs tracking-widest uppercase mb-4">
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </p>
          <p className="text-slate-500 font-light italic text-sm max-w-lg mx-auto leading-relaxed mb-8">
            A conquista do futuro, só se dá pelo excelente trabalho do presente, usando a matéria prima do passado.
          </p>
          <div className="pt-8 border-t border-white/5 flex flex-col items-center space-y-4">
            <p className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-cinzel font-bold">
              Este site é <span className="text-blue-500/60">cookie-free</span> • Privacidade por design
            </p>
            
            {/* Contador de Acessos (Hits) - GitHub Integration */}
            <div className="opacity-10 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-1000 transform scale-75 origin-center">
              <img 
                src="https://hits.dwyl.com/heder-santos/executive-portfolio.svg?style=flat-square&color=3b82f6" 
                alt="Contador de Acessos" 
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
