
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ContactProps {
  contact: {
    email: string;
    linkedin: string;
    whatsapp: string;
    location: string;
  };
}

export const ContactSection: React.FC<ContactProps> = ({ contact }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [protocolInfo, setProtocolInfo] = useState<{ analysis: string, code: string } | null>(null);
  const [formData, setFormData] = useState({ name: '', org: '', message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setStatus('submitting');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `
        Analise esta solicitação de contato para o Heder Santos:
        Nome: ${formData.name}
        Empresa: ${formData.org}
        Mensagem: ${formData.message}

        Aja como o Curador Digital dele. Use termos simples, fáceis de entender e amigáveis.
        Explique brevemente que o contato foi recebido e parece interessante por [motivo simples].
        Responda em até 2 linhas.
        Gere também um código de protocolo no estilo HS-XXXX.

        Retorne um JSON puro:
        {
          "analysis": "sua explicação simples aqui",
          "code": "HS-1234"
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{"analysis": "Sua mensagem chegou!", "code": "HS-0000"}');
      setProtocolInfo(result);
      setStatus('success');
      
      console.log("Mensagem direcionada à caixa de entrada prioritária.");

    } catch (error) {
      console.error("Erro na triagem:", error);
      setStatus('error');
    }
  };

  const contactCards = [
    {
      label: 'LinkedIn',
      value: 'Heder Santos',
      href: `https://${contact.linkedin}`,
      icon: (
        <svg className="w-6 h-6 transition-all duration-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      hoverIconColor: 'text-[#0A66C2]',
      glowColor: 'hover:shadow-[0_0_35px_rgba(10,102,194,0.4)]',
      borderColor: 'hover:border-[#0A66C2]/50'
    },
    {
      label: 'E-mail',
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: (
        <svg className="w-6 h-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path className="group-hover:stroke-[#4285F4] transition-colors duration-500" d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
          <path className="group-hover:stroke-[#EA4335] transition-colors duration-500" d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      hoverIconColor: 'text-white',
      glowColor: 'hover:shadow-[0_0_35px_rgba(234,67,53,0.35)]',
      borderColor: 'hover:border-red-500/50'
    },
    {
      label: 'WhatsApp',
      value: 'Conexão Direta',
      href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`,
      icon: (
        <svg className="w-6 h-6 transition-all duration-500" fill="currentColor" viewBox="0 0 24 24">
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
      <div className="mb-12 text-center">
        <span className="section-number">V</span>
        <h3 className="text-2xl md:text-4xl font-bold mb-1 tracking-tight text-white italic font-serif">Correspondência</h3>
        <div className="h-px w-16 md:w-20 bg-blue-600 mx-auto opacity-50"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {contactCards.map((card, i) => (
          <a
            key={i}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group glass-panel p-8 rounded-sm border border-white/5 ${card.borderColor} transition-all duration-700 flex flex-col items-center text-center space-y-4 hover:-translate-y-3 ${card.glowColor}`}
          >
            <div className={`text-slate-500 group-hover:${card.hoverIconColor} transition-all duration-500 transform group-hover:scale-110`}>
              {card.icon}
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold font-cinzel mb-1 group-hover:text-white transition-colors">
                {card.label}
              </p>
              <p className="text-xs md:text-sm font-serif italic text-slate-400 group-hover:text-white transition-colors">
                {card.value}
              </p>
            </div>
          </a>
        ))}
      </div>

      <div className="glass-panel rounded-sm border border-white/5 p-6 md:p-12 relative overflow-hidden min-h-[400px]">
        {status === 'success' ? (
          <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center space-y-6 py-8">
            <div className="w-16 h-16 rounded-full border border-blue-500/50 flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-2xl md:text-3xl font-serif italic text-white">Mensagem Recebida</h4>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              Sua solicitação foi direcionada à minha curadoria digital. Analisamos seu contato e retornaremos em até <span className="text-white font-bold">72 horas úteis</span>.
            </p>
            
            <div className="max-w-md w-full p-6 bg-white/[0.02] border border-white/5 rounded-sm text-left mt-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold font-cinzel">Protocolo Digital</p>
                <span className="text-[10px] text-blue-500 font-mono font-bold">{protocolInfo?.code}</span>
              </div>
              <p className="text-sm text-slate-300 font-serif italic leading-relaxed mb-6">
                "{protocolInfo?.analysis}"
              </p>
              <div className="flex justify-center border-t border-white/5 pt-4">
                <button 
                  onClick={() => { setStatus('idle'); setFormData({ name: '', org: '', message: '' }); }}
                  className="text-[9px] uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors font-bold font-cinzel"
                >
                  Fazer nova solicitação
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute top-6 right-6 text-[7px] md:text-[9px] uppercase tracking-[0.4em] text-slate-700 vertical-text hidden lg:block select-none">
              {status === 'submitting' ? 'PROCESSANDO...' : 'REQUISIÇÃO ESTRATÉGICA'}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="border-l-2 border-blue-500/30 pl-6">
                  <h4 className="text-[9px] uppercase tracking-widest text-slate-500 mb-4 font-bold font-cinzel">Protocolo de Contato</h4>
                  <p className="text-xs md:text-sm text-slate-400 italic leading-relaxed font-serif mb-6">
                    O intuito é estabelecer contatos profissionais focados em visão estratégica e parcerias de longo prazo.
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-bold font-cinzel">Brasília, DF</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                 <form className={`space-y-6 transition-opacity duration-500 ${status === 'submitting' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`} onSubmit={handleSubmit}>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="border-b border-white/10 py-2 focus-within:border-blue-500/50 transition-colors">
                       <label className="block text-[8px] md:text-[9px] uppercase tracking-widest text-slate-600 mb-1 font-bold font-cinzel">Seu Nome</label>
                       <input 
                         name="name"
                         required
                         value={formData.name}
                         onChange={handleInputChange}
                         type="text" 
                         className="w-full bg-transparent p-0 text-white font-light focus:outline-none placeholder-slate-800 text-xs md:text-sm font-serif italic" 
                         placeholder="Ex: João Silva" 
                       />
                     </div>
                     <div className="border-b border-white/10 py-2 focus-within:border-blue-500/50 transition-colors">
                       <label className="block text-[8px] md:text-[9px] uppercase tracking-widest text-slate-600 mb-1 font-bold font-cinzel">Empresa / Organização</label>
                       <input 
                         name="org"
                         value={formData.org}
                         onChange={handleInputChange}
                         type="text" 
                         className="w-full bg-transparent p-0 text-white font-light focus:outline-none placeholder-slate-800 text-xs md:text-sm font-serif italic" 
                         placeholder="Nome da Empresa S.A." 
                       />
                     </div>
                   </div>
                   <div className="border-b border-white/10 py-2 focus-within:border-blue-500/50 transition-colors">
                     <label className="block text-[8px] md:text-[9px] uppercase tracking-widest text-slate-600 mb-1 font-bold font-cinzel">Assunto / Mensagem</label>
                     <textarea 
                       name="message"
                       required
                       value={formData.message}
                       onChange={handleInputChange}
                       rows={2} 
                       className="w-full bg-transparent p-0 text-white font-light focus:outline-none resize-none placeholder-slate-800 text-xs md:text-sm font-serif italic" 
                       placeholder="Como posso te ajudar hoje?"
                     ></textarea>
                   </div>
                   <button 
                     disabled={status === 'submitting'}
                     className="w-full lg:w-auto px-12 py-4 bg-white text-black text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white disabled:bg-slate-800 disabled:text-slate-600 transition-all duration-700 rounded-sm shadow-2xl font-cinzel active:scale-95"
                   >
                     {status === 'submitting' ? 'Analisando...' : 'Enviar Mensagem'}
                   </button>
                 </form>
                 
                 {status === 'error' && (
                   <p className="mt-4 text-[9px] text-red-500 font-bold uppercase tracking-widest font-cinzel">Ops! Algo deu errado. Tente novamente mais tarde.</p>
                 )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
