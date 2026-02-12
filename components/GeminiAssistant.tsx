
import { GoogleGenAI, Chat } from "@google/genai";
import React, { useState, useRef, useEffect } from 'react';
import { ProfileData } from '../types.ts';

interface GeminiAssistantProps {
  profile: ProfileData;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { 
      role: 'assistant', 
      text: `Interface M. Executiva v4.2 online. Protocolo de consulta para Heder Santos estabelecido. Em que posso auxiliar?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Inicialização Direta do Motor de IA
  const initializeChatEngine = () => {
    // Acesso direto conforme instrução, confiando na injeção do bundler
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error("CRÍTICO: API Key não encontrada em process.env.API_KEY");
      return null;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Você é a Interface Executiva de Heder Santos. 
          DADOS DO PERFIL: ${JSON.stringify(profile)}.
          POSTURA: Austera, formal, extremamente profissional e concisa.
          REGRAS DE OURO:
          1. Responda em Português (Brasil).
          2. Não invente cargos ou datas. Baseie-se APENAS no contexto fornecido.
          3. Se o dado não existir, diga: "Informação não constante nos registros oficiais."
          4. Limite as respostas a 2 ou 3 parágrafos curtos.
          5. Mantenha um tom de "Secretário Executivo de Alto Nível".`,
          temperature: 0.2,
          topP: 0.8,
          topK: 40
        },
      });
    } catch (e) {
      console.error("Erro ao inicializar GoogleGenAI:", e);
      return null;
    }
  };

  useEffect(() => {
    if (!chatInstance && isOpen) {
      const chat = initializeChatEngine();
      if (chat) setChatInstance(chat);
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
      let activeChat = chatInstance;
      
      // Tentativa de reconexão se a instância não existir
      if (!activeChat) {
        activeChat = initializeChatEngine();
        if (activeChat) {
          setChatInstance(activeChat);
        } else {
          throw new Error("API_KEY_MISSING_OR_INVALID");
        }
      }

      const response = await activeChat.sendMessage({ message: userMsg });
      const aiText = response.text || "Interface em silêncio (Sem resposta de texto).";
      
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error: any) {
      console.error("Erro de Transmissão:", error);
      let errorMsg = "Houve uma oscilação na rede de dados. Por favor, tente novamente.";
      
      if (error.message?.includes("API key") || error.message === "API_KEY_MISSING_OR_INVALID") {
        errorMsg = "ERRO DE SISTEMA: Chave de API inválida ou não configurada. Verifique as configurações do projeto.";
      }

      setMessages(prev => [...prev, { role: 'assistant', text: errorMsg }]);
      setChatInstance(null); // Força reinicialização na próxima tentativa
    } finally {
      setLoading(false);
    }
  };

  // Verificação visual simples para o indicador de status
  const isOnline = !!process.env.API_KEY;

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 glass-panel flex flex-col h-[520px] animate-fade-in rounded-sm border-white/10 shadow-2xl overflow-hidden text-white">
          <div className="p-5 border-b border-white/10 bg-black/80 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] font-cinzel">EXEC-INTEL v4.2 // ONLINE</span>
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
                  Processando análise estratégica...
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
                placeholder="Consultar base de dados..."
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
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
        </button>
      )}
    </div>
  );
};
