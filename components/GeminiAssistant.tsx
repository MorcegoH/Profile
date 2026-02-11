
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
      text: `Interface M. Executiva v3.3. Protocolo de Segurança Nível 1 detectado. Aguardando comando.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBillingIssue, setIsBillingIssue] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Verificação inicial silenciosa
  useEffect(() => {
    const checkAuth = async () => {
      if (window.aistudio) {
        const authed = await window.aistudio.hasSelectedApiKey();
        if (authed) setHasAuth(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = async () => {
    if (!isOpen) {
      if (window.aistudio && !hasAuth) {
        try {
          // Ativação automática ao clicar: abre o seletor se não houver chave
          await window.aistudio.openSelectKey();
          setHasAuth(true);
          setIsBillingIssue(false);
        } catch (e) {
          console.error("Protocolo de ativação interrompido:", e);
        }
      }
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleManualSync = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasAuth(true);
      setIsBillingIssue(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Sincronização manual concluída. Cota Nível 1 restabelecida." 
      }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Se o usuário tentar enviar sem auth, força a abertura do seletor
    if (!hasAuth && window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasAuth(true);
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    setIsBillingIssue(false);

    try {
      // Instanciação imediata conforme guidelines de segurança
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é a Interface Executiva de Heder Santos. Perfil: ${JSON.stringify(profile)}. Responda de forma austera, executiva e direta. Mantenha o tom de alto nível. Use Português do Brasil.`,
          temperature: 0.2,
        },
      });

      const aiText = response.text || "Erro na extração de dados.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error: any) {
      console.error("Erro Crítico na Interface:", error);
      
      // Tratamento de erros de cota/projeto
      if (error?.message?.includes("entity was not found") || error?.message?.includes("403") || error?.message?.includes("404")) {
        setIsBillingIssue(true);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: "ALERTA: Falha na validação do Nível 1. Certifique-se de que o faturamento está ativo no projeto 'SitePerfil' do Google AI Studio." 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: "Falha na comunicação com o núcleo de IA. Tente novamente em instantes." 
        }]);
      }
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
              <div className={`w-2 h-2 rounded-full ${hasAuth && !isBillingIssue ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] font-cinzel">SISTEMA EXECUTIVO HS // V3.3</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors text-xl">&times;</button>
          </div>
          
          {/* Chat Interface */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin bg-black/40">
            {isBillingIssue && (
              <div className="p-4 border border-red-500/30 bg-red-500/5 rounded-sm">
                <p className="text-[8px] uppercase tracking-widest text-red-400 font-bold mb-2">Erro de Protocolo</p>
                <p className="text-[10px] text-slate-400 font-serif italic mb-3 leading-relaxed">
                  O projeto 'SitePerfil' exige faturamento ativo para requisições externas. Revalide sua chave ou verifique o status no console.
                </p>
                <button 
                  onClick={handleManualSync}
                  className="w-full py-2 bg-red-600/20 border border-red-500/50 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-red-600/40 transition-all rounded-sm"
                >
                  SINCRONIZAR NOVAMENTE
                </button>
              </div>
            )}

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
                <div className="bg-white/5 p-4 text-[10px] text-slate-500 italic border border-white/5 animate-pulse">Acessando registros estratégicos...</div>
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
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Consultar trajetória..."
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
          {/* Indicador de status Tier 1 */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
        </button>
      )}
    </div>
  );
};
