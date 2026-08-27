"use client";

import { useState, useEffect } from "react";
import { Lock, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";

const PIN = "2024";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === PIN) {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  if (!isClient) return <div className="min-h-screen bg-[#0a0a0a] text-white"></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="card max-w-md w-full bg-[#111111] p-8 border border-white/10 rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#DC2626]/10 rounded-full flex items-center justify-center border border-[#DC2626]/30">
              <Lock className="w-8 h-8 text-[#DC2626]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2 text-white">Admin Access</h1>
          <p className="text-white/60 text-center text-sm mb-8">Enter PIN to access lead management</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#DC2626] transition-colors text-center text-2xl tracking-[0.5em]"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            </div>
            <button type="submit" className="w-full btn-primary py-3.5 rounded-xl font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors">
              Unlock Dashboard
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-white/40 hover:text-white transition-colors inline-flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> Return to main site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
              <span>AB</span><span className="text-[#DC2626]">WOW</span> <span className="text-sm font-normal text-white/50 px-2 py-0.5 rounded bg-white/5 border border-white/10">Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/60 hover:text-white transition-colors hidden sm:flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> View Site
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm px-3 py-1.5 rounded-md hover:bg-red-400/10"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
