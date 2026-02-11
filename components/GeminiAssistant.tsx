
import { GoogleGenAI, Chat } from "@google/genai";
import React, { useState, useRef, useEffect } from 'react';
import { ProfileData } from '../types.ts';

interface GeminiAssistantProps {
  profile: ProfileData;
}

// Classe de Simulação para Modo Offline (Padrão Adapter)
class ExecutiveMockChat {
  private history: {role: string, text: string}[] = [];

  constructor(systemInstruction: string) {
    // Simula inicialização
  }

  async sendMessage(params: { message: string }) {
    await new Promise(resolve => setTimeout(resolve, 1200)); // Delay artificial para realismo
    
    return {
      text: `[MODO DEMONSTRAÇÃO] Acesso ao Núcleo Neural Restrito.\n\n` +
            `Detectei sua consulta: "${params.message}".\n\n` +
            `Como a credencial de segurança (API Key) não foi detectada neste ambiente de visualização, opero em protocolo de contingência. ` +
            `O perfil de Heder Santos destaca-se por Liderança Estratégica, Governança Corporativa e Gestão de Crises. ` +
            `Em ambiente de produção, eu forneceria uma análise detalhada baseada nestes pilares.`
    };
  }
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Tipagem flexível para aceitar tanto o Chat real quanto o Mock
  const [chatInstance, setChatInstance] = useState<any | null>(null);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { 
      role: 'assistant', 
      text: `Interface M. Executiva v4.0 operacional. Protocolo de consulta para Heder Santos estabelecido. Qual sua necessidade estratégica?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Recuperação segura da chave
  const getApiKey = () => {
    try {
      if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        const key = process.env.API_KEY.trim();
        return key.length > 0 ? key : null;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  // Inicialização Inteligente (Factory Pattern)
  const initializeChatEngine = () => {
    const apiKey = getApiKey();
    const systemInstruction = `Você é a Interface Executiva de Heder Santos. DADOS: ${JSON.stringify(profile)}.`;

    // Se não tiver chave, retorna o Mock IMEDIATAMENTE, sem tentar conectar
    if (!apiKey) {
      console.warn("SISTEMA: API Key não detectada. Iniciando protocolo de simulação.");
      return new ExecutiveMockChat(systemInstruction);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: systemInstruction + `
          POSTURA: Austera, formal, extremamente profissional e concisa.
          REGRAS: 1. Responda em Português (Brasil). 2. Baseie-se APENAS no contexto. 3. Tom de Secretário Executivo.`,
          temperature: 0.2,
          topP: 0.8,
          topK: 40
        },
      });
    } catch (e) {
      console.error("Falha ao inicializar motor real. Alternando para simulação.", e);
      return new ExecutiveMockChat(systemInstruction);
    }
  };

  useEffect(() => {
    if (!chatInstance && isOpen) {
      const engine = initializeChatEngine();
      setChatInstance(engine);
    }
  }, [isOpen, chatInstance]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      let activeEngine = chatInstance;
      
      // Auto-reparo: se a instância se perdeu, recria
      if (!activeEngine) {
        activeEngine = initializeChatEngine();
        setChatInstance(activeEngine);
      }

      const response = await activeEngine.sendMessage({ message: userMsg });
      const aiText = response.text || "Sem retorno de dados.";
      
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error: any) {
      console.error("Erro de Processamento:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Houve uma interrupção na cadeia de processamento. Por favor, reenvie sua diretriz." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const isOnline = !!getApiKey();

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 glass-panel flex flex-col h-[520px] animate-fade-in rounded-sm border-white/10 shadow-2xl overflow-hidden text-white">
          <div className="p-5 border-b border-white/10 bg-black/80 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]' : 'bg-amber-500'} animate-pulse`}></div>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] font-cinzel">
                EXEC-INTEL v4.0 // {isOnline ? 'ONLINE' : 'DEMO MODE'}
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin bg-black/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-[11px] leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-blue-600/10 text-blue-100 rounded-sm border border-blue-500/20' 
                  : 'bg-white/5 text-slate-300 rounded-sm border border-white/10 font-serif italic'
                }`}>
                  <span className="whitespace-pre-wrap">{m.text}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 text-[10px] text-slate-500 italic border border-white/5 animate-pulse font-serif">
                  {isOnline ? "Processando análise estratégica..." : "Simulando resposta..."}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-5 border-t border-white/10 bg-black/60">
            <div className="flex space-x-3">
              <input 
                type="text" 
                value={input}
                autoFocus
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isOnline ? "Consultar base de dados..." : "Teste o modo de demonstração..."}
                className="flex-grow bg-transparent border-b border-white/10 p-2 text-xs text-white outline-none focus:border-blue-500 transition-colors font-serif italic disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors font-cinzel disabled:opacity-20"
              >
                ENVIAR
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
          <div className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 ${isOnline ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]' : 'bg-amber-500'} rounded-full animate-pulse`}></div>
        </button>
      )}
    </div>
  );
};
