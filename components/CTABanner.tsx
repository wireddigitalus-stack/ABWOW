"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, FileText } from "lucide-react";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="w-full bg-gradient-to-r from-[#001f4d] via-[#002868] to-[#001f4d] text-white py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Subtle flag accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DC2626] via-white to-[#DC2626]" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#DC2626] via-white to-[#DC2626]" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="text-3xl">🇺🇸</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Ready to Transform Your Property?
        </h2>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Get a free, no-obligation estimate today. We deliver quality paving that lasts.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#estimator"
            className="px-8 py-4 bg-[#DC2626] text-white rounded-full font-bold hover:bg-[#B91C1C] transition-colors w-full sm:w-auto shadow-lg"
          >
            Get Free Estimate
          </Link>
          <a
            href="tel:4235557283"
            className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-[#002868] transition-colors w-full sm:w-auto"
          >
            Call (423) 555-7283
          </a>
        </div>
      </div>
    </section>
  );
}

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls past the hero section (approx 400px)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe"
        >
          <div className="glass-strong border-t border-[rgb(var(--color-border))] p-3 flex gap-3">
            <a
              href="tel:4235557283"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-[#002868] text-white rounded-xl font-semibold text-sm"
            >
              <Phone className="w-4 h-4 text-white" />
              Call Now
            </a>
            <Link
              href="#estimator"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-[#DC2626] text-white rounded-xl font-semibold text-sm"
            >
              <FileText className="w-4 h-4" />
              Free Estimate
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
