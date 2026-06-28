"use client";

import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Abhijeet's AI assistant. You can ask me anything about his skills, experience, projects, or background."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: userMessage,
        history: messages.slice(1).map(m => ({ role: m.role, content: m.content }))
      });
      
      const { data } = res.data;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply
      }]);
    } catch (error: any) {
      toast.error('Failed to get a response from the AI.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting right now."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="mb-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Meet My AI Assistant</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Powered by Llama 3 and RAG. Ask questions about my experience, skills, and projects to get instant answers.
        </p>
      </div>

      <div className="rounded-2xl border bg-card text-card-foreground shadow-lg overflow-hidden flex flex-col h-[600px]">
        <div 
          ref={scrollRef}
          className="flex-grow p-6 overflow-y-auto space-y-6"
        >
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                  : 'bg-muted rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 max-w-[85%] mr-auto">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-muted rounded-tl-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-card">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-grow flex h-12 rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground w-12 h-12 hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
