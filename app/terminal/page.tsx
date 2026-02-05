'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai' | 'system', text: string }>>([
    { type: 'system', text: 'Welcome to Pi Buddy!' },
    { type: 'system', text: 'Type "help" for available commands or just chat with me!' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [mascotMood, setMascotMood] = useState<'happy' | 'sad' | 'thinking'>('happy');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd === '') return;

    setMessages(prev => [...prev, { type: 'user', text: cmd }]);
    setInput('');
    setIsTyping(true);
    setMascotMood('thinking');

    // Simulate AI thinking delay
    setTimeout(() => {
      let response = '';
      
      switch (trimmedCmd) {
        case 'help':
          response = `Available commands:
            • help - Show this help message
            • pi [n] - Get first n digits of pi (e.g., "pi 10")
            • fact - Get a fun pi fact
            • clear - Clear the terminal
            • home - Go back to home page
            `;
          setMascotMood('happy');
          break;
        
        case 'clear':
          setMessages([
            { type: 'system', text: 'Terminal cleared! ✨' },
          ]);
          setMascotMood('happy');
          setIsTyping(false);
          return;
        
        case 'home':
          window.location.href = '/';
          return;
        
        case 'fact':
          const facts = [
            'Pi is infinite and never repeats! It goes on forever without any pattern.',
            'The symbol π was first used by mathematician William Jones in 1706.',
            'Pi Day is celebrated on March 14th (3/14) every year!',
            'The digits of pi pass randomness tests, appearing truly random.',
            'Pi is an irrational number, meaning it cannot be expressed as a simple fraction.',
          ];
          response = facts[Math.floor(Math.random() * facts.length)];
          setMascotMood('happy');
          break;
        
        default:
          if (trimmedCmd.startsWith('pi ')) {
            const numStr = trimmedCmd.substring(3).trim();
            const num = parseInt(numStr);
            
            if (isNaN(num) || num < 1) {
              response = 'Please provide a valid number! Example: pi 20';
              setMascotMood('sad');
            } else if (num > 100) {
              response = 'Whoa! That\'s a lot of digits! Let me give you the first 100: 3.' + 
                        '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
              setMascotMood('happy');
            } else {
              const piDigits = '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
              response = `First ${num} digits of pi: ${piDigits.substring(0, num + 1).split('').join(' ')}`;
              setMascotMood('happy');
            }
          } else {
            // General chat responses
            const chatResponses = [
              'That\'s interesting! Pi is pretty amazing, right?',
              'I love talking about pi! Did you know it\'s used in calculating circles?',
              'Hmm, I\'m just a simple pi terminal, but I think that\'s cool!',
              'Want to know a pi fact? Type "fact"!',
              'Pi is my favorite number! What about you?',
              'That reminds me of the beauty of mathematics!',
            ];
            response = chatResponses[Math.floor(Math.random() * chatResponses.length)];
            setMascotMood('happy');
          }
      }

      setMessages(prev => [...prev, { type: 'ai', text: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      handleCommand(input);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] font-mono relative overflow-hidden selection:bg-[#CEA2FD] selection:text-white">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-5" 
           style={{
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>

      {/* Pi Watermark */}
      <div className="fixed -bottom-40 -right-40 text-[600px] font-bold text-black/[0.02] pointer-events-none select-none -rotate-12">
        π
      </div>

      <div className="relative container mx-auto px-8 py-6 max-w-4xl">
        {/* Back Button */}
        <div className="mb-4">
          <Link href="/">
            <button className="bg-[#ffffff] border-[4px] border-[#333] px-6 py-3 font-black text-[#333] shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] hover:shadow-[6px_6px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100">
              ← BACK
            </button>
          </Link>
        </div>

        {/* Terminal Window */}
        <div className="bg-[#ffffff] border-[4px] border-[#333] shadow-[12px_12px_0px_0px_rgba(51,51,51,1)] overflow-hidden">
          {/* Terminal Header (macOS style) */}
          <div className="bg-[#CEA2FD] border-b-[4px] border-[#333] p-4 flex items-center gap-2">
            {/* Traffic Light Buttons */}
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-[#FF6B6B] border-[2px] border-[#333]"></div>
              <div className="w-4 h-4 bg-[#FFE66D] border-[2px] border-[#333]"></div>
              <div className="w-4 h-4 bg-[#95E1D3] border-[2px] border-[#333]"></div>
            </div>
            
            {/* Title */}
            <div className="flex-1 text-center">
              <span className="text-[#333] font-black tracking-wider">TERMINAL</span>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="bg-[#2D2D2D] p-6 h-[350px] overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div key={index} className="flex gap-2">
                  {message.type === 'user' && (
                    <>
                      <span className="text-[#FF99CC] font-black">YOU</span>
                      <span className="text-[#FF99CC]">▸</span>
                      <span className="text-[#ffffff]">{message.text}</span>
                    </>
                  )}
                  {message.type === 'ai' && (
                    <>
                      <span className="text-[#CEA2FD] font-black">AI</span>
                      <span className="text-[#CEA2FD]">▸</span>
                      <span className="text-[#ffffff] whitespace-pre-line">{message.text}</span>
                    </>
                  )}
                  {message.type === 'system' && (
                    <>
                      <span className="text-[#95E1D3]">●</span>
                      <span className="text-[#95E1D3]">{message.text}</span>
                    </>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2">
                  <span className="text-[#CEA2FD] font-black">AI</span>
                  <span className="text-[#CEA2FD]">▸</span>
                  <span className="text-[#ffffff] animate-pulse">typing...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Terminal Input */}
          <div className="bg-[#2D2D2D] border-t-[4px] border-[#333] p-4">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <span className="text-[#FF99CC] font-black">YOU</span>
              <span className="text-[#FF99CC]">▸</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-transparent text-[#ffffff] outline-none font-mono placeholder:text-[#666666]"
                placeholder="Type a command or message..."
                autoFocus
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="bg-[#CEA2FD] border-[3px] border-[#333] px-4 py-2 font-black text-[#333] shadow-[3px_3px_0px_0px_rgba(51,51,51,1)] hover:shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0px_0px_rgba(51,51,51,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
              >
                SEND
              </button>
            </form>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 text-center">
          <p className="text-[#666] font-bold text-sm">
            💡 Try typing <span className="text-[#CEA2FD]">help</span>, <span className="text-[#CEA2FD]">pi 20</span>, or <span className="text-[#CEA2FD]">fact</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CEA2FD;
          border: 2px solid #333;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b88fe8;
        }
      `}</style>
    </div>
  );
}
