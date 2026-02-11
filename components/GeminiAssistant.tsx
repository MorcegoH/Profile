
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
      text: `Interface M. Executiva v3.4 iniciada. Protocolo Nível 1 ativo. Aguardando sua consulta.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (window.aistudio) {
        const authed = await window.aistudio.hasSelectedApiKey();
        setHasAuth(authed);
      }
    };
    checkAuth();
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleAuthentication = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setHasAuth(true);
        setDebugError(null);
        setMessages(prev => [...prev, { role: 'assistant', text: "Protocolo de segurança revalidado com sucesso." }]);
      } catch (e) {
        console.error("Falha na revalidação:", e);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    setDebugError(null);

    try {
      // Criação de instância única por requisição para evitar stale keys
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("Chave de API não detectada. Por favor, selecione sua chave.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Usando o modelo gemini-3-flash-preview conforme diretrizes para tarefas de texto
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é a Interface Executiva de Heder Santos. Perfil: ${JSON.stringify(profile)}. Responda com austeridade, precisão e tom executivo (Português do Brasil). Respostas curtas e diretas são preferíveis.`,
          temperature: 0.1, // Menor temperatura para maior sobriedade
        },
      });

      const aiText = response.text || "Interface em silêncio. Sem dados retornados.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error: any) {
      console.error("Erro de Protocolo:", error);
      
      let errorMessage = "Interrupção na transmissão. ";
      const errorStr = error?.message || "";

      if (errorStr.includes("Requested entity was not found") || errorStr.includes("404")) {
        errorMessage += "O projeto 'SitePerfil' não foi localizado ou o faturamento ainda está pendente.";
        setHasAuth(false); // Força nova seleção de chave
      } else if (errorStr.includes("403") || errorStr.includes("permission")) {
        errorMessage += "Acesso negado. Sua chave Nível 1 pode precisar de alguns minutos para propagar o faturamento.";
      } else if (errorStr.includes("API_KEY_INVALID")) {
        errorMessage += "Chave de API inválida ou expirada.";
        setHasAuth(false);
      } else {
        errorMessage += "O núcleo de IA reportou instabilidade técnica.";
      }

      setDebugError(errorStr);
      setMessages(prev => [...prev, { role: 'assistant', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 glass-panel flex flex-col h-[550px] animate-fade-in rounded-sm border-white/10 shadow-2xl overflow-hidden text-white">
          {/* Header */}
          <div className="p-5 border-b border-white/10 bg-black/80 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-2.5 h-2.5 rounded-full ${hasAuth ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-cinzel">EXEC-INTEL v3.4 // {hasAuth ? 'ONLINE' : 'AUTH_REQ'}</span>
            </div>
            <button onClick={toggleChat} className="text-slate-500 hover:text-white transition-colors text-xl">&times;</button>
          </div>
          
          {/* Chat Body */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin bg-black/40">
            {!hasAuth && (
              <div className="p-4 border border-blue-500/30 bg-blue-500/5 rounded-sm mb-4">
                <p className="text-[9px] uppercase tracking-widest text-blue-400 font-bold mb-2">Protocolo de Autorização</p>
                <p className="text-[10px] text-slate-400 font-serif italic mb-3">A conexão com a sua chave Nível 1 precisa ser estabelecida para prosseguir.</p>
                <button 
                  onClick={handleAuthentication}
                  className="w-full py-2 bg-blue-600/20 border border-blue-500/50 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-blue-600/40 transition-all rounded-sm"
                >
                  AUTORIZAR ACESSO
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
                <div className="bg-white/5 p-4 text-[10px] text-slate-500 italic border border-white/5 animate-pulse">Consultando base estratégica...</div>
              </div>
            )}

            {debugError && (
              <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 text-[8px] text-red-400/60 font-mono break-all leading-tight">
                [SYS_LOG]: {debugError}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-white/10 bg-black/60">
            <div className="flex space-x-3">
              <input 
                type="text" 
                value={input}
                disabled={loading || !hasAuth}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={hasAuth ? "Solicitar análise..." : "Aguardando autorização..."}
                className="flex-grow bg-transparent border-b border-white/10 p-2 text-xs text-white outline-none focus:border-blue-500 transition-colors font-serif italic disabled:opacity-20"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !hasAuth}
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
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </button>
      )}
    </div>
  );
};
