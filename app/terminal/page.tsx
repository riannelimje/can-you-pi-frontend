'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://can-you-pi-1041928881529.us-central1.run.app/api';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai' | 'system', text: string }>>([
    { type: 'system', text: 'Welcome to Pi Buddy!' },
    { type: 'system', text: 'Type "help" for available commands or just chat with me!' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [mascotMood, setMascotMood] = useState<'happy' | 'sad' | 'thinking'>('happy');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [piDigits, setPiDigits] = useState<string>('');
  const [infoOpen, setInfoOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/pi.txt')
      .then(res => res.text())
      .then(text => setPiDigits(text.trim()))
      .catch(err => console.error('Failed to load pi digits:', err));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    
    if (trimmedCmd === '') return;

    // Handle local commands first
    if (trimmedCmd.toLowerCase() === 'clear') {
      setMessages([
        { type: 'system', text: 'Terminal cleared!' },
      ]);
      setInput('');
      setMascotMood('happy');      setTimeout(() => inputRef.current?.focus(), 0);      return;
    }

    if (trimmedCmd.toLowerCase() === 'home') {
      window.location.href = '/';
      return;
    }

    if (trimmedCmd.toLowerCase() === 'help') {
      setMessages(prev => [...prev, 
        { type: 'user', text: cmd },
        { type: 'ai', text: `Available commands:
        • help - Show this help message
        • pi [n] - Get the nth decimal of pi (e.g., "pi 10" returns 5)
        • clear - Clear the terminal
        • home - Go back to home page

        Or just chat with me! I can help you:
        • Start a Pi memorisation game
        • Verify your Pi sequences
        • Give hints and encouragement
        • Play position guessing games

        Try saying "Let's play!"` }
      ]);
      setInput('');
      setMascotMood('happy');
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    // Handle pi [n] command
    if (trimmedCmd.toLowerCase().startsWith('pi ')) {
      const numStr = trimmedCmd.substring(3).trim();
      const num = parseInt(numStr);
      
      if (isNaN(num) || num < 1) {
        setMessages(prev => [...prev, 
          { type: 'user', text: cmd },
          { type: 'ai', text: 'Please provide a valid number! Example: pi 20' }
        ]);
        setInput('');
        setMascotMood('sad');
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }

      if (!piDigits) {
        setMessages(prev => [...prev, 
          { type: 'user', text: cmd },
          { type: 'system', text: 'Loading pi digits...' }
        ]);
        setInput('');
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }

      // Get the digit at position n (0-indexed, so subtract 1)
      if (num > piDigits.length) {
        setMessages(prev => [...prev, 
          { type: 'user', text: cmd },
          { type: 'ai', text: `We only have up to ${piDigits.length} decimal places!` }
        ]);
        setInput('');
        setMascotMood('sad');
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }

      const digit = piDigits[num - 1];
      setMessages(prev => [...prev, 
        { type: 'user', text: cmd },
        { type: 'ai', text: `The ${num}${num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th'} decimal of pi is: ${digit}` }
      ]);
      setInput('');
      setMascotMood('happy');
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: cmd }]);
    setInput('');
    setIsTyping(true);
    setMascotMood('thinking');

    try {
      // Call the chat API
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedCmd,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      // Update conversation ID if this is a new conversation
      if (!conversationId) {
        setConversationId(data.conversation_id);
      }

      // Add AI response
      setMessages(prev => [...prev, { type: 'ai', text: data.message }]);
      setMascotMood('happy');
    } catch (error) {
      console.error('Error chatting with AI:', error);
      setMessages(prev => [...prev, { 
        type: 'system', 
        text: 'Oops! Failed to connect to AI. Please try again!' 
      }]);
      setMascotMood('sad');
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      handleCommand(input);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] font-mono relative overflow-x-hidden selection:bg-[#CEA2FD] selection:text-white">
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

      <div className="relative container mx-auto px-4 sm:px-8 py-6 max-w-4xl">
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
            <form onSubmit={handleSubmit} className="flex gap-2 items-center min-w-0">
              <span className="text-[#FF99CC] font-black">YOU</span>
              <span className="text-[#FF99CC]">▸</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                className="flex-1 min-w-0 bg-transparent text-[#ffffff] outline-none font-mono placeholder:text-[#666666]"
                placeholder="Type a command or message..."
                autoFocus
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="shrink-0 bg-[#CEA2FD] border-[3px] border-[#333] px-4 py-2 font-black text-[#333] shadow-[3px_3px_0px_0px_rgba(51,51,51,1)] hover:shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0px_0px_rgba(51,51,51,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
              >
                SEND
              </button>
            </form>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <p className="text-[#666] font-bold text-sm">
            Try typing <span className="text-[#CEA2FD]">help</span> or <span className="text-[#CEA2FD]">pi 20</span>
          </p>
          <div className="relative group">
            <button
              type="button"
              aria-label="Info"
              aria-expanded={infoOpen}
              onClick={() => setInfoOpen((open) => !open)}
              onBlur={() => setInfoOpen(false)}
              className="w-7 h-7 rounded-full bg-[#ffffff] border-[3px] border-[#333] text-[#333] font-black text-sm shadow-[2px_2px_0px_0px_rgba(51,51,51,1)]"
            >
              i
            </button>
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 bg-[#ffffff] border-[3px] border-[#333] p-3 text-xs font-bold text-[#333] shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 ${infoOpen ? 'opacity-100 pointer-events-auto' : ''}`}>
              If you see oops! the token limit might be reached, try typing "start" or try again after a while.
            </div>
          </div>
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
