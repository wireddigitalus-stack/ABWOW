"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ArrowUp, Phone, Sparkles, CheckCircle2 } from "lucide-react";
import { getChatResponse, extractLeadDetails } from "@/lib/chatbot-ai";
import { addChatLog, addLead } from "@/lib/store";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const QUICK_SUGGESTIONS = [
  "💰 How much does paving cost?",
  "🏡 Residential driveway paving",
  "🏢 Commercial parking lot",
  "🛡️ Sealcoating & crack repair",
  "📍 What areas do you serve?",
  "📞 Free on-site estimate"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Hey there! 👋 I'm the ABWOW Paving assistant.\n\nAsk me anything about driveway paving, commercial parking lots, sealcoating, or ballpark pricing across the Tri-Cities. How can I help you today?",
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
      const fullText = messages.map(m => m.content).join(" ");
      const extracted = extractLeadDetails(fullText);
      
      addChatLog({
        leadName: extracted.name,
        leadPhone: extracted.phone,
        leadEmail: extracted.email,
        messages: messages.map(m => ({ 
          role: m.role, 
          content: m.content, 
          timestamp: typeof m.timestamp === 'string' ? m.timestamp : m.timestamp.toISOString()
        })),
      });
    }
  };

  const handleSendText = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date()
    };

    // Check if user dropped lead details
    const extracted = extractLeadDetails(text);
    if (extracted.phone && !leadCaptured) {
      setLeadCaptured(true);
      addLead({
        name: extracted.name || "Chat Visitor",
        phone: extracted.phone,
        email: extracted.email || "",
        address: extracted.address || "",
        service: "Inquired via AI Assistant",
        message: `Chat conversation with phone: ${extracted.phone}`,
        source: "chatbot"
      });
    }

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const history = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));
      const responseContent = getChatResponse(userMessage.content, history);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 400 + 400); // 400-800ms natural response
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText(inputValue);
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
            className="fixed bottom-32 right-6 md:bottom-20 md:right-8 z-50 p-4 rounded-full bg-[#DC2626] text-white shadow-xl shadow-black/60 hover:bg-[#b91c1c] hover:shadow-[#DC2626]/40 flex items-center justify-center transition-all animate-[pulse_3s_ease-in-out_infinite]"
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
            className="fixed bottom-0 right-0 md:bottom-28 md:right-8 z-50 w-full h-[85vh] md:w-[400px] md:h-[540px] flex flex-col overflow-hidden glass-strong border border-white/15 md:rounded-3xl max-md:rounded-t-3xl shadow-2xl shadow-black bg-[#0d0d0d]/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#DC2626] to-[#002868] flex items-center justify-center shadow-md">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-black"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    ABWOW Assistant <span className="text-[10px] bg-[#DC2626]/20 text-[#ef4444] px-1.5 py-0.5 rounded font-mono">24/7 AI</span>
                  </h3>
                  <p className="text-[11px] text-white/50">Online • Typically replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="tel:4235557283"
                  className="p-2 rounded-full bg-[#002868] hover:bg-[#001f4d] text-white transition-colors flex items-center gap-1 text-xs font-bold px-2.5 py-1.5"
                  title="Call Alan Bracken directly"
                >
                  <Phone size={13} />
                  <span className="hidden sm:inline">Call</span>
                </a>
                <button 
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Notification banner when contact is captured */}
            {leadCaptured && (
              <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Contact info logged! Alan will call you shortly.</span>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[88%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
                >
                  <div 
                    className={`p-3.5 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-[#DC2626] text-white rounded-br-sm shadow-md' 
                        : 'bg-[#181818] text-white/90 border border-white/10 rounded-bl-sm leading-relaxed'
                    }`}
                  >
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  <span className={`text-[10px] text-white/40 mt-1 ${msg.role === 'user' ? 'self-end pr-1' : 'self-start pl-1'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex flex-col max-w-[85%] self-start">
                  <div className="p-3.5 rounded-2xl rounded-bl-sm bg-[#181818] border border-white/10 w-16">
                    <div className="flex gap-1 items-center justify-center h-2">
                      <motion.div 
                        animate={{ y: [0, -4, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} 
                        className="w-1.5 h-1.5 bg-[#DC2626] rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -4, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }} 
                        className="w-1.5 h-1.5 bg-white/70 rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -4, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4 }} 
                        className="w-1.5 h-1.5 bg-[#002868] rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-black/40 border-t border-white/5 flex overflow-x-auto gap-1.5 hide-scrollbar">
              {QUICK_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendText(sug)}
                  disabled={isTyping}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-white/80 hover:text-white whitespace-nowrap transition-all shrink-0"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/60 backdrop-blur-md pb-safe">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question or enter your phone #..."
                  className="w-full bg-black/50 border border-white/15 rounded-full py-3 pl-4 pr-12 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#DC2626] transition-colors"
                />
                <button
                  onClick={() => handleSendText(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 p-2 bg-[#DC2626] hover:bg-[#b91c1c] rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
                  aria-label="Send message"
                >
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
