
import React, { useState, useEffect } from 'react';
import { PROFILE_DATA } from './constants';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { About } from './components/About';
import { ExperienceSection } from './components/Experience';
import { SkillsSection } from './components/Skills';
import { ContactSection } from './components/Contact';
import { GeminiAssistant } from './components/GeminiAssistant';

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
          <p className="text-slate-500 font-light italic text-sm max-w-md mx-auto leading-relaxed mb-8">
            Autoridade técnica e excelência estratégica em gestão executiva.
          </p>
          <div className="pt-8 border-t border-white/5">
            <p className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-cinzel font-bold">
              Este site é <span className="text-blue-500/60">cookie-free</span> • Privacidade por design
            </p>
          </div>
        </div>
      </footer>

      {/* Assistente Digital (Curadoria) */}
      <GeminiAssistant profile={PROFILE_DATA} />
    </div>
  );
};

export default App;
