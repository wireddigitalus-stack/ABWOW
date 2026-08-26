"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import { getChatResponse } from "@/lib/chatbot-ai";
import { addChatLog } from "@/lib/store";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Hey there! 👋 I'm the ABWOW Paving assistant. Ask me anything about our paving services, get a quick price estimate, or I can connect you with Alan directly. How can I help?",
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleClose = () => {
    setIsOpen(false);
    if (messages.length > 1) {
      // Try to extract some info from conversation
      const fullText = messages.filter(m => m.role === 'user').map(m => m.content).join(" ");
      const phoneMatch = fullText.match(/[\d\-\(\)\s]{10,}/);
      const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      
      const phone = phoneMatch ? phoneMatch[0].trim() : undefined;
      const email = emailMatch ? emailMatch[0].trim() : undefined;
      
      // Save conversation log
      addChatLog({
        leadPhone: phone,
        leadEmail: email,
        messages: messages.map(m => ({ 
          role: m.role, 
          content: m.content, 
          timestamp: typeof m.timestamp === 'string' ? m.timestamp : m.timestamp.toISOString()
        })),
      });
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const responseContent = getChatResponse(userMessage.content, history);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 500 + 500); // Natural 500-1000ms delay
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-6 md:right-6 max-md:bottom-20 z-50 p-4 rounded-full bg-[#DC2626] text-black shadow-lg shadow-black/50 hover:shadow-[#DC2626]/20 flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]"
            aria-label="Open chat"
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 right-0 md:bottom-24 md:right-6 z-50 w-full h-[85vh] md:w-[380px] md:h-[500px] flex flex-col overflow-hidden glass-strong border border-white/10 md:rounded-2xl max-md:rounded-t-2xl shadow-2xl shadow-black"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#DC2626] to-red-300 flex items-center justify-center">
                    <MessageCircle size={16} className="text-black" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">ABWOW Assistant</h3>
                  <p className="text-xs text-white/60">Typically replies instantly</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
                >
                  <div 
                    className={`p-3 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-tr from-[#DC2626] to-[#ef6464] text-black rounded-br-sm' 
                        : 'bg-black/60 text-white/90 border border-white/5 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  <span className={`text-[10px] text-white/40 mt-1 ${msg.role === 'user' ? 'self-end pr-1' : 'self-start pl-1'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex flex-col max-w-[85%] self-start">
                  <div className="p-4 rounded-2xl rounded-bl-sm bg-black/60 border border-white/5 w-16">
                    <div className="flex gap-1 items-center justify-center h-2">
                      <motion.div 
                        animate={{ y: [0, -4, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} 
                        className="w-1.5 h-1.5 bg-white/50 rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -4, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }} 
                        className="w-1.5 h-1.5 bg-white/50 rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -4, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4 }} 
                        className="w-1.5 h-1.5 bg-white/50 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/40 backdrop-blur-md pb-safe">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#DC2626]/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 p-1.5 bg-[#DC2626] rounded-full text-black disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-80"
                  aria-label="Send message"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
