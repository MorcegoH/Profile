
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ProfileData } from '../types.ts';

interface GeminiAssistantProps {
  profile: ProfileData;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: `Bem-vindo à interface estratégica de Heder Santos. Como posso auxiliar em sua análise profissional?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    const userMsg = input.trim();
    if (!userMsg || loading) return;

    // Obter chave de forma segura
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : null;

    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
      setMessages(prev => [...prev, { role: 'assistant', text: "Configuração Pendente: A chave de acesso à base estratégica não foi detectada no ambiente." }]);
      setInput('');
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Persona: Assistente Executivo Sênior de Heder Santos. Contexto profissional: ${JSON.stringify(profile)}. Diretriz: Respostas austeras, formais, precisas e curtas. Use português. Foco em governança e gestão.`,
          temperature: 0.5,
        },
      });

      const aiText = response.text || "Protocolo de resposta não gerou dados.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error: any) {
      console.error("Critical Assistant Failure:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: `Falha na conexão estratégica. Causa provável: ${error.message || 'Erro de rede ou chave inválida'}.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 glass-panel flex flex-col h-[500px] animate-fade-in rounded-sm shadow-2xl overflow-hidden text-white border-white/10">
          <div className="p-5 border-b border-white/10 bg-black/95 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] font-cinzel opacity-80">Interface M. Executiva</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors text-xl">&times;</button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin bg-black/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-[11px] leading-relaxed rounded-sm border ${
                  m.role === 'user' 
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-50 font-serif' 
                  : 'bg-white/[0.03] border-white/10 text-slate-300 italic font-serif'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="text-[9px] text-slate-500 italic font-serif">Acessando base de dados...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-5 border-t border-white/10 bg-black/60">
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Solicitar análise técnica..."
                className="flex-grow bg-transparent border-b border-white/10 p-2 text-xs text-white outline-none focus:border-blue-500 transition-colors font-serif italic"
              />
              <button 
                onClick={handleSend} 
                disabled={loading} 
                className="text-[9px] font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors font-cinzel disabled:opacity-30"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center w-12 h-12 glass-panel hover:bg-white/5 transition-all duration-300 rounded-full border-white/20 shadow-xl"
        >
          <svg className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </button>
      )}
    </div>
  );
};
