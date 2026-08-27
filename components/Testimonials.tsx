"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  location: string;
  service: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Alan and his team did an outstanding job on our driveway. Professional, on time, and the quality is incredible. Best paving company in the Tri-Cities!",
    name: "Mike R.",
    location: "Johnson City, TN",
    service: "Residential Driveway"
  },
  {
    quote: "We needed our church parking lot repaved and ABWOW delivered beyond expectations. Fair pricing and excellent communication throughout.",
    name: "Pastor David W.",
    location: "Bristol, TN",
    service: "Commercial Parking Lot"
  },
  {
    quote: "Had our commercial lot sealcoated and striped. Looks brand new! Alan was great to work with — very responsive and honest.",
    name: "Sarah T.",
    location: "Kingsport, TN",
    service: "Sealcoating & Striping"
  },
  {
    quote: "After getting quotes from 4 different companies, ABWOW was the most professional and fairly priced. The driveway looks amazing.",
    name: "Jennifer L.",
    location: "Elizabethton, TN",
    service: "Residential Driveway"
  }
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-[rgb(var(--color-bg-secondary))]">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real feedback from our satisfied clients across the Tri-Cities.</p>
        </div>

        <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0 hide-scrollbar">
          {testimonials.map((testimonial, index) => (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
              key={index}
              className="card card-hover min-w-[300px] sm:min-w-[400px] flex-shrink-0 snap-center border-l-4 border-l-[#C0C0C0] p-6 m-2 md:m-0"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#DC2626] text-[#DC2626]" />
                ))}
              </div>
              <p className="text-[rgb(var(--color-text))] italic mb-6">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-[rgb(var(--color-text))]">{testimonial.name}</p>
                <p className="text-sm text-[rgb(var(--color-text-muted))]">{testimonial.location}</p>
                <p className="text-xs font-medium text-[#DC2626] mt-1">{testimonial.service}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
