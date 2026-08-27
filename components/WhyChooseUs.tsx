"use client";

import { motion } from "framer-motion";
import { User, Calculator, ShieldCheck, Award, BadgeCheck, Star } from "lucide-react";

const reasons = [
  {
    title: "Owner Operated",
    description: "Alan personally oversees every project",
    icon: User,
  },
  {
    title: "Free Estimates",
    description: "No-obligation quotes, no surprises",
    icon: Calculator,
  },
  {
    title: "Licensed & Insured",
    description: "Fully licensed and insured for your peace of mind",
    icon: ShieldCheck,
  },
  {
    title: "Quality Materials",
    description: "We use only premium-grade asphalt materials",
    icon: Award,
  },
  {
    title: "Warranty Backed",
    description: "Our work is backed by warranty",
    icon: BadgeCheck,
  },
  {
    title: "5-Star Reviews",
    description: "Consistently rated 5 stars by our customers",
    icon: Star,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-[rgb(var(--color-bg-secondary))]">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Why Choose ABWOW Paving?
          </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10"
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="h-16 w-16 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 flex items-center justify-center text-[#DC2626] mb-5 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-[rgb(var(--color-text))] mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-muted))]">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
