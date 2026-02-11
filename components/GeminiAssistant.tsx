
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
      text: `Interface M. Executiva aguardando inicialização do protocolo de segurança.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBillingIssue, setIsBillingIssue] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (window.aistudio) {
        const authed = await window.aistudio.hasSelectedApiKey();
        setHasAuth(authed);
      }
    };
    if (isOpen) checkAuth();
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleActivate = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasAuth(true);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Chave vinculada com sucesso. A interface está desbloqueada para consultas estratégicas." 
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
      // Instanciação obrigatória seguindo as regras de segurança do AI Studio
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é a Interface Executiva do Heder Santos. Perfil: ${JSON.stringify(profile)}. Responda de forma austera, executiva e direta.`,
          temperature: 0.2,
        },
      });

      const aiText = response.text || "Sem resposta do servidor.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error: any) {
      console.error("Erro na Interface:", error);
      
      let errorMsg = "Ocorreu um erro na comunicação com a IA.";
      
      // Identifica se é problema de cota/billing (comum no Nível Gratuito)
      if (error?.message?.includes("entity was not found") || error?.message?.includes("403") || error?.message?.includes("404")) {
        setIsBillingIssue(true);
        errorMsg = "Acesso Negado pela Google Cloud. O 'Nível Gratuito' sem faturamento configurado pode restringir o uso desta interface em sites externos.";
      }

      setMessages(prev => [...prev, { role: 'assistant', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 glass-panel flex flex-col h-[520px] animate-fade-in rounded-sm border-white/10 shadow-2xl overflow-hidden text-white">
          {/* Header */}
          <div className="p-5 border-b border-white/10 bg-black/80 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${hasAuth ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-cinzel">M. Executiva v3.0</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">&times;</button>
          </div>
          
          {/* Corpo do Chat */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin bg-black/40">
            {/* Aviso de Autenticação / Billing */}
            {!hasAuth || isBillingIssue ? (
              <div className="p-5 border border-blue-500/30 bg-blue-500/5 rounded-sm space-y-4">
                <p className="text-[9px] uppercase tracking-widest text-blue-400 font-bold">Ação Necessária</p>
                <p className="text-[11px] text-slate-400 italic font-serif leading-relaxed">
                  Para garantir o funcionamento, clique no botão abaixo para autorizar o uso da sua chave do AI Studio. 
                  {isBillingIssue && <strong className="block mt-2 text-red-400/80">Importante: Conforme seu print, é altamente recomendável ativar o 'Faturamento' no Google Cloud para liberar a cota de uso externo.</strong>}
                </p>
                <button 
                  onClick={handleActivate}
                  className="w-full py-2 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all rounded-sm"
                >
                  {isBillingIssue ? "Tentar Reativar" : "Ativar Interface"}
                </button>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block text-center text-[8px] text-slate-600 underline">Documentação de Billing</a>
              </div>
            ) : null}

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
                <div className="bg-white/5 p-4 text-[10px] text-slate-500 italic border border-white/5">Consultando base...</div>
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
                disabled={!hasAuth && !isBillingIssue}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={hasAuth ? "Analisar trajetória..." : "Aguardando ativação..."}
                className="flex-grow bg-transparent border-b border-white/10 p-2 text-xs text-white outline-none focus:border-blue-500 transition-colors font-serif italic disabled:opacity-20"
              />
              <button 
                onClick={handleSend}
                disabled={loading || (!hasAuth && !isBillingIssue)}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors font-cinzel disabled:text-slate-800"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 glass-panel hover:bg-white/5 transition-all duration-500 rounded-full border-white/20 shadow-xl"
        >
          <div className="w-6 h-6 text-blue-400 flex items-center justify-center font-cinzel font-bold text-lg group-hover:scale-110 transition-transform">AI</div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
        </button>
      )}
    </div>
  );
};
