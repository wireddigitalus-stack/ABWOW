"use client";

import { motion } from "framer-motion";
import { HardHat } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="section-padding overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block uppercase tracking-wider text-sm font-bold text-[#DC2626] mb-4">
              About ABWOW Paving
            </span>
            <h2 className="section-title mb-6">
              Quality Paving, Personally Delivered
            </h2>
            
            <div className="space-y-4 text-[rgb(var(--color-text-secondary))] mb-8 text-lg">
              <p>
                Led by Alan Bracken, an experienced paving professional with deep roots in the Tri-Cities community, ABWOW Paving is built on a foundation of trust, quality, and hard work.
              </p>
              <p>
                As a smaller, owner-operated business, we take pride in offering what the big corporate pavers can&apos;t: personal attention to every single detail. When you choose us, you get direct communication with the owner, no runaround, and a genuine commitment to your satisfaction. Alan personally oversees every project to ensure our high standards are met.
              </p>
              <p>
                We are passionate about doing the job right the first time. Whether it&apos;s a residential driveway or a commercial parking lot, we treat every property as if it were our own.
              </p>
            </div>
            
            <Link 
              href="#contact" 
              className="btn-primary inline-flex items-center justify-center"
            >
              Get Your Free Estimate
            </Link>
          </motion.div>

          {/* Right Column: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden group shadow-2xl">
              <img 
                src="/images/IMG_8466.jpg" 
                alt="ABWOW Paving crew operating equipment on a Tennessee job site" 
                className="w-full h-full object-cover aspect-[4/5] md:aspect-[3/4]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Est. Badge */}
              <div className="absolute bottom-6 right-6 glass-strong rounded-lg px-4 py-3 flex items-center gap-3 border border-[#C0C0C0]/30 z-30">
                <span className="text-2xl font-bold text-white">Est. 2014</span>
              </div>
            </div>

            {/* Small floating photo */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-[rgb(var(--color-bg))] shadow-xl z-20">
              <img 
                src="/images/IMG_8513.jpg" 
                alt="ABWOW Paving operator on CAT roller" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Small floating video card */}
            <div className="absolute -top-6 -right-6 w-36 h-36 md:w-48 md:h-48 rounded-xl overflow-hidden border-4 border-[rgb(var(--color-bg))] shadow-xl z-20 hidden md:block">
              <video 
                src="/images/video-4.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
