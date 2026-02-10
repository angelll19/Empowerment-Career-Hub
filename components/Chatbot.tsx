
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/gemini';

export const Chatbot: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await geminiService.chat(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't process that. Let's try again!" }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-[90vw] md:w-96 glass-morphism rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 z-50 h-[500px] animate-in slide-in-from-bottom-4">
      <div className="p-5 gradient-teal-purple text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✨</div>
          <span className="font-bold">Growth Coach AI</span>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-md transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        <div className="bg-white p-3 rounded-2xl text-sm shadow-sm max-w-[80%]">
          Hello! I'm your Career Hub assistant. How can I help you grow today?
        </div>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl text-sm shadow-sm max-w-[80%] ${m.role === 'user' ? 'bg-teal-500 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl text-sm shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-50 px-4 py-2 rounded-xl text-sm outline-none focus:ring-1 focus:ring-teal-400"
          placeholder="Ask about circles, projects..."
        />
        <button 
          onClick={handleSend}
          className="bg-teal-500 text-white p-2 rounded-xl hover:bg-teal-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
    </div>
  );
};
