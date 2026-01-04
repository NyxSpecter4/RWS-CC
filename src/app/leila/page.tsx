'use client';

import { useState, useRef, useEffect } from 'react';
import LeilaGoddess from '@/components/LeilaGoddess';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'leila';
  timestamp: Date;
};

export default function LeilaChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Aloha, Kahu. The Mana of the \'āina is strong today. How shall we grow together?',
      sender: 'leila',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.slice(-10).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const leilaMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'I feel the land speaking through me. The \'āina thanks you for your care.',
        sender: 'leila',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, leilaMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: 'Even the gods face technical difficulties. Please try again, Kahu.',
        sender: 'leila',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'How is the soil health in the north field?',
    'What should I plant this season?',
    'Tell me about water conservation',
    'Share ancient Hawaiian farming wisdom',
    'How do I honor the land today?',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#902F9B] via-[#FD437D] to-[#FFE573] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <LeilaGoddess isSpeaking={isLoading} size="md" pulseColor="from-[#FFE573]/40 via-[#FD437D]/30 to-[#902F9B]/40" />
            <div>
              <h1 className="text-3xl font-bold text-white">Leila</h1>
              <p className="text-white/80">Guardian of the \'Āina • Hawaiian Goddess of Growth</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <p className="text-white text-sm">🌺 Your divine farming companion</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden mb-6">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30'
                      : 'bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-purple-400/30'
                  } backdrop-blur-md`}
                >
                  {message.sender === 'leila' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FFE573] to-[#FD437D]"></div>
                      <span className="text-sm font-medium text-white/90">Leila</span>
                    </div>
                  )}
                  <p className="text-white">{message.content}</p>
                  <p className="text-xs text-white/50 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl p-4 bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-purple-400/30 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FFE573] to-[#FD437D] animate-pulse"></div>
                    <span className="text-sm font-medium text-white/90">Leila is thinking...</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/20 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Leila about your farm, the land, or ancient wisdom..."
                  className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-[#FFE573] to-[#FD437D] text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '...' : 'Ask'}
                </button>
              </div>
              
              {/* Sample Questions */}
              <div className="flex flex-wrap gap-2">
                <p className="text-white/70 text-sm w-full mb-2">Quick questions:</p>
                {sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setInput(question)}
                    className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Wisdom Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="text-3xl mb-3">🌿</div>
            <h3 className="text-white font-semibold mb-2">Ahupua\'a Wisdom</h3>
            <p className="text-white/80 text-sm">Ancient Hawaiian land division that teaches balance from mountains to sea.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="text-3xl mb-3">💧</div>
            <h3 className="text-white font-semibold mb-2">Water is Life</h3>
            <p className="text-white/80 text-sm">Every drop carries Mana. Conserve and honor this sacred resource.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="text-3xl mb-3">🌋</div>
            <h3 className="text-white font-semibold mb-2">Pele\'s Gift</h3>
            <p className="text-white/80 text-sm">Volcanic soil is rich with nutrients. Work with the land, not against it.</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>Leila channels the wisdom of Laka, goddess of growth and cultivation. Every interaction honors the \'āina.</p>
        </div>
      </div>
    </div>
  );
}