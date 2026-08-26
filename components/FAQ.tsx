"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How much does asphalt paving cost in the Tri-Cities area?",
    answer: "The cost of asphalt paving varies based on square footage, existing surface condition, and site preparation required. We offer free, detailed estimates for all projects in Bristol, Johnson City, and Kingsport to give you an accurate price for your specific needs."
  },
  {
    question: "How long does a new asphalt driveway last?",
    answer: "With proper installation and regular maintenance, a new asphalt driveway in Northeast Tennessee can last 15 to 20 years. Regular sealcoating every 2-3 years will significantly extend its lifespan and keep it looking brand new."
  },
  {
    question: "What is sealcoating and why is it important?",
    answer: "Sealcoating applies a protective layer over your asphalt, shielding it from UV rays, water, and chemical spills. It prevents oxidation and cracking, saving you thousands in premature replacement costs."
  },
  {
    question: "Do you offer free estimates?",
    answer: "Yes! As an owner-operated business, we provide free, no-obligation estimates for all residential and commercial paving projects across the Tri-Cities and surrounding areas."
  },
  {
    question: "What areas do you serve?",
    answer: "We proudly serve the entire Tri-Cities region including Bristol, Johnson City, and Kingsport, TN. We also cover surrounding communities like Elizabethton, Jonesborough, Gray, and Southwest Virginia towns like Abingdon and Gate City."
  },
  {
    question: "How long does a paving project take?",
    answer: "Most residential driveways can be completed in just 1-2 days. Larger commercial projects may take longer. We work efficiently to minimize disruption while ensuring the highest quality results."
  },
  {
    question: "Can you pave in cold weather?",
    answer: "Asphalt requires warm temperatures to properly compact and cure. In our region, our paving season typically runs from Spring through late Fall, though we perform repairs and sealcoating as weather permits."
  },
  {
    question: "Do you offer financing?",
    answer: "We offer competitive pricing and flexible payment options to help make your paving project affordable. Contact us directly to discuss payment plans and financing options for larger projects."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="section-padding bg-[rgb(var(--color-bg))]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="section-container max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Answers to common questions about our paving services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={index}
              className="card overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-[rgb(var(--color-text))]">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#DC2626]" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-0 text-[rgb(var(--color-text-secondary))]">
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
