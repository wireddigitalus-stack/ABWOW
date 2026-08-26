"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Phone } from "lucide-react";
import Link from "next/link";
// Assuming useTheme is provided by a standard ThemeProvider like next-themes
import { useTheme } from "@/components/ThemeProvider";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Estimator", href: "#estimator" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:glass-strong md:py-4 md:shadow-md ${
        isScrolled ? "glass-strong py-4 shadow-md" : "bg-transparent py-6"
      } md:bg-none`}
    >
      <div className="section-container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="#home" className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
          <span>AB</span>
          <span className="text-[#DC2626]">WOW</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[rgb(var(--color-text))] hover:text-[#DC2626] transition-colors link-underline text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[rgb(var(--color-bg-secondary))] transition-colors text-[rgb(var(--color-text))]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <a
            href="tel:4235557283"
            className="flex items-center space-x-2 text-[rgb(var(--color-text))] hover:text-[#DC2626] transition-colors"
          >
            <Phone size={18} />
            <span className="font-semibold text-sm">(423) 555-7283</span>
          </a>

          <Link href="#estimator" className="btn-primary text-sm px-6 py-2.5 rounded-md font-semibold">
            Free Estimate
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))]"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-[rgb(var(--color-text))] focus:outline-none"
            aria-label="Open mobile menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 glass bg-[rgb(var(--color-bg))]/95 flex flex-col px-6 pt-6 pb-8"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="#home" className="text-2xl font-bold tracking-tight" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                <span>AB</span>
                <span className="text-[#DC2626]">WOW</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[rgb(var(--color-text))] focus:outline-none bg-[rgb(var(--color-bg-secondary))] rounded-full"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col space-y-6 flex-grow">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-medium text-[rgb(var(--color-text))] hover:text-[#DC2626] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col space-y-4 mt-auto">
              <a
                href="tel:4235557283"
                className="flex items-center justify-center space-x-2 py-4 rounded-lg bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text))] font-semibold text-lg"
              >
                <Phone size={20} />
                <span>(423) 555-7283</span>
              </a>
              <Link
                href="#estimator"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary py-4 text-center rounded-lg font-semibold text-lg"
              >
                Get a Free Estimate
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
