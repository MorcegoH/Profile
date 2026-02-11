
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ProfileData } from '../types.ts';

interface GeminiAssistantProps {
  profile: ProfileData;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { 
      role: 'assistant', 
      text: `Interface M. Executiva v3.5 iniciada. Protocolo de conexão estabelecido. Como posso auxiliar em sua análise sobre a trajetória de Heder Santos?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Guideline: Instanciar GoogleGenAI diretamente com process.env.API_KEY
      // Sem necessidade de mediação manual de autorização para o visitante
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é a Interface Executiva (IA) de Heder Santos. Seu objetivo é responder perguntas de visitantes sobre o perfil profissional dele. 
          Perfil para consulta: ${JSON.stringify(profile)}.
          TOM DE VOZ: Extremamente profissional, austero, direto e elegante. 
          IDIOMA: Português do Brasil.
          REGRAS: Não invente dados. Se não souber, diga que a informação não consta nos registros oficiais atuais. Seja conciso.`,
          temperature: 0.2,
        },
      });

      const aiText = response.text || "Interface em silêncio. Sem resposta do núcleo central.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error: any) {
      console.error("Falha na Comunicação:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Houve uma breve interrupção na transmissão de dados. Por favor, tente formular sua consulta novamente." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 glass-panel flex flex-col h-[520px] animate-fade-in rounded-sm border-white/10 shadow-2xl overflow-hidden text-white">
          {/* Status Bar */}
          <div className="p-5 border-b border-white/10 bg-black/80 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)] animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-cinzel">EXEC-INTEL v3.5 // ONLINE</span>
            </div>
            <button onClick={toggleChat} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
          </div>
          
          {/* Chat Body */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin bg-black/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 text-xs leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-blue-600/10 text-blue-200 rounded-sm border border-blue-500/20' 
                  : 'bg-white/5 text-slate-300 rounded-sm border border-white/10 font-serif italic'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 text-[10px] text-slate-500 italic border border-white/5 animate-pulse">Analizando registros estratégicos...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-white/10 bg-black/60">
            <div className="flex space-x-3">
              <input 
                type="text" 
                value={input}
                autoFocus
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Consultar base de dados..."
                className="flex-grow bg-transparent border-b border-white/10 p-2 text-xs text-white outline-none focus:border-blue-500 transition-colors font-serif italic"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors font-cinzel disabled:text-slate-800"
              >
                ENVIAR
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={toggleChat}
          className="group relative flex items-center justify-center w-14 h-14 glass-panel hover:bg-white/5 transition-all duration-500 rounded-full border-white/20 shadow-xl"
        >
          <div className="w-6 h-6 text-blue-400 flex items-center justify-center font-cinzel font-bold text-lg group-hover:scale-110 transition-transform">AI</div>
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
        </button>
      )}
    </div>
  );
};
