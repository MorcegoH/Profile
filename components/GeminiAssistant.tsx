
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
      text: `Interface M. Executiva v3.6 operacional. Registros de Heder Santos carregados. Como posso colaborar com sua análise estratégica?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Inicialização silenciosa e automática do núcleo de IA
  useEffect(() => {
    const initChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
        const newChat = ai.chats.create({
          model: 'gemini-2.5-flash-lite-latest',
          config: {
            systemInstruction: `Você é o Agente Executivo Virtual de Heder Santos. 
            CONTEXTO: ${JSON.stringify(profile)}.
            DIRETRIZES: 
            1. Responda sempre de forma austera, profissional e executiva.
            2. Seja extremamente conciso (máximo 3 frases).
            3. Use o Português do Brasil de alto nível.
            4. Se não encontrar um dado específico no currículo, responda: "Informação não mapeada nos registros atuais de governança."
            5. Nunca mencione que você é um modelo de linguagem; aja como a interface do currículo dele.`,
            temperature: 0.1,
          },
        });
        setChatInstance(newChat);
      } catch (e) {
        console.error("Erro na inicialização do núcleo:", e);
      }
    };
    initChat();
  }, [profile]);

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
      let currentChat = chatInstance;
      
      // Se por algum motivo a instância falhou, tentamos recriar no momento do envio
      if (!currentChat) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
        currentChat = ai.chats.create({
          model: 'gemini-2.5-flash-lite-latest',
          config: { systemInstruction: `Atue como assistente de Heder Santos: ${JSON.stringify(profile)}` }
        });
        setChatInstance(currentChat);
      }

      const response = await currentChat.sendMessage({ message: userMsg });
      const aiText = response.text || "Transmissão encerrada sem dados.";
      
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error: any) {
      console.error("Falha Crítica:", error);
      
      // Tratamento de erro elegante para o usuário
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "O núcleo de IA está processando um volume alto de requisições. Por favor, tente novamente em alguns segundos para reestabelecer a conexão." 
      }]);
      
      // Tenta reiniciar o chat para a próxima mensagem
      setChatInstance(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 glass-panel flex flex-col h-[520px] animate-fade-in rounded-sm border-white/10 shadow-2xl overflow-hidden text-white">
          {/* Header Executivo */}
          <div className="p-5 border-b border-white/10 bg-black/80 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] animate-pulse"></div>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] font-cinzel">SISTEMA INTEGRADO v3.6 // ATIVO</span>
            </div>
            <button onClick={toggleChat} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
          </div>
          
          {/* Corpo do Chat */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin bg-black/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-[11px] leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-blue-600/10 text-blue-100 rounded-sm border border-blue-500/20' 
                  : 'bg-white/5 text-slate-300 rounded-sm border border-white/10 font-serif italic'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 text-[10px] text-slate-500 italic border border-white/5 animate-pulse font-serif">
                  Acessando base de dados estratégica...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Área de Input */}
          <div className="p-5 border-t border-white/10 bg-black/60">
            <div className="flex space-x-3">
              <input 
                type="text" 
                value={input}
                autoFocus
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Solicitar análise executiva..."
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
          onClick={toggleChat}
          className="group relative flex items-center justify-center w-14 h-14 glass-panel hover:bg-white/5 transition-all duration-500 rounded-full border-white/20 shadow-xl"
        >
          <div className="w-6 h-6 text-blue-400 flex items-center justify-center font-cinzel font-bold text-lg group-hover:scale-110 transition-transform">AI</div>
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
        </button>
      )}
    </div>
  );
};
