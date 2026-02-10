import React, { useState } from 'react';

interface HeaderProps {
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Início', id: 'home', num: 'I' },
    { label: 'Perfil', id: 'sobre-mim', num: 'II' },
    { label: 'Trajetória', id: 'experiencia', num: 'III' },
    { label: 'Competências', id: 'competencias', num: 'IV' },
    { label: 'Contato', id: 'contato', num: 'V' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset para compensar o header fixo (aproximadamente 100px)
      const headerOffset = 110;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setIsMenuOpen(false);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] md:w-[calc(100%-4rem)] max-w-7xl z-50 glass-panel rounded-full px-6 md:px-12 h-14 md:h-20 flex items-center justify-between border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
        <div 
          onClick={(e) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl md:text-3xl font-bold tracking-tight text-white flex items-center italic font-serif group cursor-pointer"
        >
          H<span className="text-blue-500 ml-0.5 group-hover:translate-x-1 transition-transform duration-500">S</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-10 h-full">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`text-[9px] lg:text-[10px] uppercase tracking-[0.4em] transition-all duration-700 relative h-full flex items-center space-x-2 group ${
                activeSection === item.id ? 'text-white' : 'text-slate-500 hover:text-white'
              }`}
            >
              <span className={`text-[12px] font-cinzel font-bold transition-opacity duration-500 ${activeSection === item.id ? 'opacity-100 text-blue-500' : 'opacity-40'}`}>{item.num}</span>
              <span className="font-cinzel font-bold">{item.label}</span>
              <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 via-purple-500 to-transparent transition-transform duration-700 origin-left ${
                activeSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
              }`}></span>
            </a>
          ))}
        </nav>

        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white/70 hover:text-white transition-colors p-2"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] transition-all duration-700 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={closeMenu}></div>
        <div className={`absolute top-0 right-0 h-full w-full max-w-[300px] bg-black border-l border-white/10 flex flex-col pt-28 px-10 space-y-10 transition-transform duration-700 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full shadow-none'}`}>
          <div className="mb-14 border-b border-white/10 pb-8">
            <span className="text-white text-4xl font-serif italic font-bold">H<span className="text-blue-500">S</span></span>
          </div>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`text-sm uppercase tracking-[0.5em] font-cinzel flex items-center space-x-6 py-2 transition-colors ${
                activeSection === item.id ? 'text-blue-400' : 'text-slate-500 hover:text-white'
              }`}
            >
              <span className="text-[16px] font-cinzel font-bold opacity-40 w-8">{item.num}</span>
              <span className="font-bold">{item.label}</span>
            </a>
          ))}
          <div className="mt-auto pb-16">
             <div className="h-px w-12 bg-blue-600 mb-6"></div>
             <p className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-cinzel font-bold">BRASÍLIA, BRASIL</p>
          </div>
        </div>
      </div>
    </>
  );
};