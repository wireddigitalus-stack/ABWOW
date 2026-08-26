"use client";

import { motion } from "framer-motion";
import { ChevronDown, CheckCircle2, Calendar, Star, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";

const stats = [
  { label: "Projects Completed", value: "200+", icon: CheckCircle2 },
  { label: "Years Experience", value: "10+", icon: Calendar },
  { label: "Client Rating", value: "5-Star", icon: Star },
  { label: "Operated", value: "Locally", icon: MapPin },
];

export default function Hero() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-20"
    >
      {/* Background Image */}
      <img 
        src="/images/hero-banner.jpg" 
        alt="ABWOW Paving crew operating CAT roller on fresh asphalt in the Tri-Cities Tennessee" 
        className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
      />
      {/* Gradient Overlay - subtle so banner shows through */}
      <div className={`absolute inset-0 ${
        mounted && theme === "light" ? "bg-hero-gradient-light" : "bg-hero-gradient"
      } opacity-40`} />
      {/* Dark Overlay - light enough to see the banner */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/40" />

      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(220,38,38,0.6) 0%, rgba(220,38,38,0) 70%)',
            top: '-10%',
            right: '-5%',
            animation: 'blob1 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, rgba(239,68,68,0) 70%)',
            bottom: '5%',
            left: '-8%',
            animation: 'blob2 25s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(220,38,38,0.4) 0%, rgba(185,28,28,0) 70%)',
            top: '40%',
            left: '50%',
            animation: 'blob3 18s ease-in-out infinite',
          }}
        />
      </div>

      {/* Subtle Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgb(var(--color-text)) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="section-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-grow flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Headline */}
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1]" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              <span className="block text-white dark:text-white">Paving That Makes</span>
              <span className="block mt-2">
                <span className="text-white dark:text-white">You Say </span>
                <span className="gold-gradient-text" style={{ textShadow: 'none' }}>WOW.</span>
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
            From residential driveways to commercial parking lots &mdash; ABWOW Paving delivers quality craftsmanship across Bristol, Johnson City, Kingsport, and beyond.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#estimator" className="btn-primary w-full sm:w-auto px-8 py-4 rounded-md font-semibold text-lg flex items-center justify-center">
              Get Free Estimate
            </Link>
            <a href="tel:4235557283" className="btn-secondary w-full sm:w-auto px-8 py-4 rounded-md font-semibold text-lg flex items-center justify-center gap-2">
              <Phone size={20} />
              Call (423) 555-7283
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-12 z-10"
      >
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-4">
                    <Icon className="text-[#DC2626]" size={24} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--color-text))] mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Video Showcase Strip */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="hidden md:flex justify-center gap-6 mt-8 mb-8 z-10 w-full max-w-6xl mx-auto px-8"
      >
        <div className="glass p-2 rounded-3xl w-72 aspect-video overflow-hidden relative shadow-lg">
          <video 
            src="/images/video-1.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="glass p-2 rounded-3xl w-72 aspect-video overflow-hidden relative shadow-lg">
          <video 
            src="/images/video-2.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-[rgb(var(--color-text-muted))] text-xs uppercase tracking-widest mb-2 font-medium">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="text-[#DC2626]" size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
