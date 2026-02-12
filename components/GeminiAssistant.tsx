
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
      text: `Protocolo M. Executiva v4.2 ativo.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const initializeChatEngine = () => {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error("API Key não encontrada.");
      return null;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Você é a Interface Executiva de Heder Santos. 
          DADOS: ${JSON.stringify(profile)}.
          POSTURA: Austera, formal, extremamente profissional e concisa.
          REGRAS:
          1. Português (Brasil).
          2. Baseie-se APENAS no contexto fornecido.
          3. Respostas curtas e diretas.`,
          temperature: 0.1,
          topP: 0.8,
          topK: 40
        },
      });
    } catch (e) {
      console.error(e);
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
      if (!activeChat) {
        activeChat = initializeChatEngine();
        if (activeChat) setChatInstance(activeChat);
        else throw new Error("API_KEY_ERROR");
      }

      const response = await activeChat.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', text: response.text || "Sem resposta." }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Erro de conexão." }]);
      setChatInstance(null);
    } finally {
      setLoading(false);
    }
  };

  const isOnline = !!process.env.API_KEY;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-64 md:w-72 glass-panel flex flex-col h-[400px] animate-fade-in rounded-sm border-white/5 shadow-2xl overflow-hidden text-white/80 bg-black/60 backdrop-blur-3xl">
          <div className="p-3 border-b border-white/5 bg-black/40 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className={`w-1 h-1 rounded-full ${isOnline ? 'bg-blue-500/50' : 'bg-red-500/50'}`}></div>
              <span className="text-[7px] font-bold uppercase tracking-[0.3em] font-cinzel opacity-40">INTELLIGENCE</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors text-sm">&times;</button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-none bg-transparent">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 text-[10px] leading-tight ${
                  m.role === 'user' 
                  ? 'bg-blue-600/5 text-blue-200/60 border border-blue-500/10' 
                  : 'text-slate-400 font-serif italic border-l border-white/5 pl-3'
                }`}>
                  <span className="whitespace-pre-wrap">{m.text}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="text-[8px] text-slate-600 italic animate-pulse font-serif pl-3">
                  Processando...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-white/5 bg-black/20">
            <div className="flex items-center">
              <input 
                type="text" 
                value={input}
                autoFocus
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Consultar..."
                className="flex-grow bg-transparent p-1 text-[10px] text-white/50 outline-none focus:text-white/80 transition-colors font-serif italic disabled:opacity-20"
              />
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-8 h-8 rounded-full border border-white/5 bg-white/[0.01] opacity-10 hover:opacity-100 transition-all duration-1000"
        >
          <div className="w-1 h-1 bg-blue-500/30 rounded-full group-hover:bg-blue-500 transition-colors"></div>
          <div className="absolute inset-0 rounded-full border border-blue-500/0 group-hover:border-blue-500/20 group-hover:scale-125 transition-all duration-1000"></div>
        </button>
      )}
    </div>
  );
};
