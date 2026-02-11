
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ProfileData } from '../types.ts';

interface GeminiAssistantProps {
  profile: ProfileData;
}

// Interface matching the environment's expected AIStudio type to resolve declaration conflicts
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAuth, setHasAuth] = useState<boolean>(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { 
      role: 'assistant', 
      text: `Interface M. Executiva pronta. Aguardando autorização de acesso à base estratégica para iniciar análise.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkStatus = async () => {
      // Use window.aistudio.hasSelectedApiKey() to check whether an API key has been selected
      if (window.aistudio) {
        try {
          const authed = await window.aistudio.hasSelectedApiKey();
          setHasAuth(authed);
        } catch (e) {
          console.error("Auth check failed:", e);
        }
      }
    };
    if (isOpen) checkStatus();
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleActivate = async () => {
    if (window.aistudio) {
      try {
        // Trigger the key selection dialog via openSelectKey()
        await window.aistudio.openSelectKey();
        // Guideline: MUST assume the key selection was successful after triggering openSelectKey() and proceed
        setHasAuth(true); 
        setMessages(prev => [...prev, { role: 'assistant', text: "Acesso autorizado. Como posso auxiliar em sua análise estratégica agora?" }]);
      } catch (e) {
        console.error("Failed to open key selector:", e);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Guideline: Create a new GoogleGenAI instance right before making an API call to ensure up-to-date key usage
      // Guideline: The API key must be obtained exclusively from the environment variable process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const response = await ai.models.generateContent({
        // Using Pro model for complex reasoning tasks (resume assistant)
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é a Interface M. Executiva, assistente virtual do Heder Santos. 
          Perfil do Heder: ${JSON.stringify(profile)}. 
          Tom de voz: Altamente profissional, austero, conciso e estratégico. 
          Idioma: Português Brasileiro.`,
          temperature: 0.5,
        },
      });

      // Guideline: Access text property directly (not as a method)
      const aiText = response.text || "Sem retorno da base de dados.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error: any) {
      console.error("AI Error:", error);
      let errorMsg = "Falha na comunicação estratégica.";
      
      // Guideline: Handle "Requested entity was not found" by resetting auth state
      if (error?.message?.includes("Requested entity was not found") || error?.message?.includes("404")) {
        errorMsg = "Sessão não identificada ou projeto faturado não localizado. Por favor, reative a interface para validar sua credencial.";
        setHasAuth(false);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 glass-panel flex flex-col h-[500px] animate-fade-in rounded-sm border-white/10 shadow-2xl overflow-hidden text-white">
          <div className="p-5 border-b border-white/10 bg-black/60 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${hasAuth ? 'bg-green-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`}></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-cinzel text-white/90">Interface M. Executiva</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors text-xl">&times;</button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin bg-black/20">
            {!hasAuth && (
              <div className="p-6 border border-blue-500/20 bg-blue-500/5 rounded-sm text-center space-y-4 mb-4">
                <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold font-cinzel">Configuração Necessária</p>
                <p className="text-xs text-slate-400 italic font-serif">A base estratégica requer validação de identidade (GCP Billing) para processar consultas.</p>
                <button 
                  onClick={handleActivate}
                  className="w-full py-3 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500 transition-all rounded-sm shadow-lg shadow-blue-900/20"
                >
                  Ativar Interface
                </button>
                {/* Guideline: A link to the billing documentation must be provided */}
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="block text-[8px] text-slate-600 underline hover:text-slate-400">Documentação de Faturamento</a>
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
                <div className="bg-white/5 p-4 text-[10px] text-slate-500 italic">Processando consulta estratégica...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-5 border-t border-white/10 bg-black/40">
            <div className="flex space-x-3">
              <input 
                type="text" 
                disabled={!hasAuth}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={hasAuth ? "Solicitar análise técnica..." : "Interface Bloqueada"}
                className="flex-grow bg-transparent border-b border-white/10 p-2 text-xs text-white outline-none focus:border-blue-500 transition-colors font-serif italic disabled:opacity-20"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !hasAuth}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors font-cinzel disabled:text-slate-700"
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
          <svg className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
        </button>
      )}
    </div>
  );
};
