
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ProfileData } from '../types.ts';

interface GeminiAssistantProps {
  profile: ProfileData;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAuth, setHasAuth] = useState<boolean>(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { 
      role: 'assistant', 
      text: `Interface M. Executiva v3.2 ativada. Aguardando sua consulta.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBillingIssue, setIsBillingIssue] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Verifica o estado da chave ao montar e quando o estado de autenticação muda
  useEffect(() => {
    const checkAuth = async () => {
      if (window.aistudio) {
        const authed = await window.aistudio.hasSelectedApiKey();
        setHasAuth(authed);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = async () => {
    if (!isOpen) {
      // Se não estiver autenticado ao abrir, tenta ativar automaticamente
      if (window.aistudio && !hasAuth) {
        try {
          await window.aistudio.openSelectKey();
          setHasAuth(true); // Assume sucesso imediato para evitar race conditions
          setIsBillingIssue(false);
        } catch (e) {
          console.error("Erro na ativação automática:", e);
        }
      }
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleManualActivate = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasAuth(true);
      setIsBillingIssue(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Sincronização reestabelecida. Interface pronta para análise." 
      }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    setIsBillingIssue(false);

    try {
      // Criação de instância imediata garantindo o uso da chave atual do ambiente
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é a Interface Executiva de Heder Santos. Perfil: ${JSON.stringify(profile)}. Responda de forma austera, executiva, direta e em Português do Brasil.`,
          temperature: 0.3,
        },
      });

      const aiText = response.text || "Falha na decodificação da resposta.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error: any) {
      console.error("Erro na Interface:", error);
      
      // Se o erro for de projeto não encontrado ou 403, sinaliza problema de Billing
      if (error?.message?.includes("entity was not found") || error?.message?.includes("403") || error?.message?.includes("404")) {
        setIsBillingIssue(true);
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Erro de protocolo. Verifique o faturamento da conta no Google AI Studio ou revalide sua chave." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 glass-panel flex flex-col h-[520px] animate-fade-in rounded-sm border-white/10 shadow-2xl overflow-hidden text-white">
          {/* Top Bar */}
          <div className="p-5 border-b border-white/10 bg-black/80 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${hasAuth && !isBillingIssue ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-cinzel">Exec-Interface v3.2</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors text-xl">&times;</button>
          </div>
          
          {/* Chat Body */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin bg-black/40">
            {isBillingIssue && (
              <div className="p-4 border border-red-500/30 bg-red-500/5 rounded-sm mb-4">
                <p className="text-[9px] uppercase tracking-widest text-red-400 font-bold mb-2">Restrição de Acesso</p>
                <p className="text-[10px] text-slate-400 font-serif italic mb-3">
                  O sistema detectou uma limitação de faturamento (Billing). Certifique-se de que sua chave pertence a um projeto pago.
                </p>
                <button 
                  onClick={handleManualActivate}
                  className="w-full py-2 bg-red-600/20 border border-red-500/50 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-red-600/40 transition-all rounded-sm"
                >
                  REAUTORIZAR CHAVE
                </button>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 text-xs leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-blue-600/20 text-blue-100 rounded-sm border border-blue-500/30' 
                  : 'bg-white/5 text-slate-300 rounded-sm border border-white/10 font-serif italic'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 text-[10px] text-slate-500 italic border border-white/5 animate-pulse">Sincronizando com base de dados...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-5 border-t border-white/10 bg-black/60">
            <div className="flex space-x-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Solicitar insight estratégico..."
                className="flex-grow bg-transparent border-b border-white/10 p-2 text-xs text-white outline-none focus:border-blue-500 transition-colors font-serif italic"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors font-cinzel disabled:text-slate-800"
              >
                Enviar
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
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
        </button>
      )}
    </div>
  );
};
