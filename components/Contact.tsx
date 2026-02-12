
import React from 'react';

interface ContactProps {
  contact: {
    email: string;
    linkedin: string;
    whatsapp: string;
    location: string;
  };
}

export const ContactSection: React.FC<ContactProps> = ({ contact }) => {
  const contactCards = [
    {
      label: 'LinkedIn',
      value: 'Heder Santos',
      href: `https://${contact.linkedin}`,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      hoverIconColor: 'text-[#0A66C2]',
      glowColor: 'hover:shadow-[0_0_35px_rgba(10,102,194,0.4)]',
      borderColor: 'hover:border-[#0A66C2]/50'
    },
    {
      label: 'E-mail Direto',
      value: contact.email,
      href: `mailto:${contact.email}`,
      // Ícone do Gmail com suporte a múltiplas cores no hover
      icon: (
        <svg className="w-6 h-6 transition-colors duration-500" viewBox="0 0 24 24" fill="currentColor">
          <path className="group-hover:fill-[#EA4335] transition-colors duration-500" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
        </svg>
      ),
      hoverIconColor: 'text-[#EA4335]', 
      glowColor: 'hover:shadow-[0_0_35px_rgba(234,67,53,0.4)]',
      borderColor: 'hover:border-[#EA4335]/50'
    },
    {
      label: 'WhatsApp',
      value: 'Conexão Executiva',
      href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.301-.15-1.779-.877-2.053-.976-.275-.1-.475-.15-.675.15s-.776.976-.951 1.176-.35.225-.65.075c-.3-.15-1.267-.467-2.414-1.489-.893-.796-1.495-1.78-1.671-2.08-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525-.675-1.625-.925-2.225c-.244-.589-.491-.51-.675-.519-.175-.009-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.026-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.116 3.232 5.125 4.532.715.31 1.273.495 1.708.633.717.227 1.369.195 1.884.118.574-.085 1.779-.726 2.029-1.426.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
        </svg>
      ),
      hoverIconColor: 'text-[#25D366]',
      glowColor: 'hover:shadow-[0_0_35px_rgba(37,211,102,0.45)]',
      borderColor: 'hover:border-[#25D366]/50'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="mb-16 text-center">
        <span className="section-number">V</span>
        <h3 className="text-2xl md:text-5xl font-bold mb-1 tracking-tight text-white italic font-serif">Correspondência</h3>
        <div className="h-px w-16 md:w-32 bg-blue-600 mx-auto opacity-50 mt-4"></div>
        <p className="text-slate-500 font-cinzel text-[10px] tracking-[0.4em] uppercase mt-8 font-bold">Canais Oficiais de Comunicação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contactCards.map((card, i) => (
          <a
            key={i}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group glass-panel p-10 md:p-14 rounded-sm border border-white/5 ${card.borderColor} transition-all duration-700 flex flex-col items-center text-center space-y-6 hover:-translate-y-4 ${card.glowColor}`}
          >
            <div className={`text-slate-500 transition-all duration-500 transform group-hover:scale-125 ${card.label === 'E-mail Direto' ? '' : `group-hover:${card.hoverIconColor}`}`}>
              {card.icon}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] text-slate-500 font-bold font-cinzel group-hover:text-white transition-colors">
                {card.label}
              </p>
              <p className="text-sm md:text-base font-serif italic text-slate-400 group-hover:text-white transition-colors">
                {card.value}
              </p>
            </div>
            <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
               <span className="text-[9px] text-blue-400 font-cinzel tracking-widest uppercase">Acessar Canal §</span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-20 text-center">
        <div className="inline-block p-8 border border-white/5 bg-white/[0.01] rounded-sm">
          <p className="text-xs text-slate-500 italic font-serif max-w-lg mx-auto leading-relaxed">
            "A prontidão na resposta é o primeiro pilar da eficiência executiva. Sinta-se à vontade para utilizar os canais acima para diálogos estratégicos ou parcerias institucionais."
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-1 h-1 bg-blue-500/30 rounded-full"></div>
            <div className="w-1 h-1 bg-blue-500/30 rounded-full"></div>
            <div className="w-1 h-1 bg-blue-500/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
