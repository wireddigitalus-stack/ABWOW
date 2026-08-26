"use client";

import { motion } from "framer-motion";
import { Home, Building2, Shield, Layers, Wrench, SquareParking, ArrowRight } from "lucide-react";

const services = [
  {
    title: "Residential Driveways",
    description: "New driveway installation, resurfacing, and repairs for homes across the Tri-Cities area.",
    icon: Home,
    image: "/images/IMG_8500.jpg",
    alt: "ABWOW crew paving a residential driveway in Tennessee"
  },
  {
    title: "Commercial Parking Lots",
    description: "Professional parking lot paving, resurfacing, and maintenance for businesses.",
    icon: Building2,
    image: "/images/IMG_8475.jpg",
    alt: "Fresh asphalt commercial parking lot paved by ABWOW Paving"
  },
  {
    title: "Sealcoating",
    description: "Protective sealcoating to extend the life of your asphalt surfaces and restore appearance.",
    icon: Shield,
    image: "/images/IMG_8514.jpg",
    alt: "Asphalt roller compacting fresh sealcoat on commercial surface"
  },
  {
    title: "Grading & Paving",
    description: "Expert grading and paving for proper drainage and a solid, lasting foundation.",
    icon: Layers,
    video: "/images/video-3.mp4",
  },
  {
    title: "Crack & Pothole Repair",
    description: "Fast, reliable repair services to fix cracks, potholes, and surface damage.",
    icon: Wrench,
    image: "/images/IMG_8450.jpg",
    alt: "CAT roller smoothing repaired asphalt surface"
  },
  {
    title: "Lot Marking & Striping",
    description: "ADA-compliant parking lot striping, marking, and signage.",
    icon: SquareParking,
    image: "/images/IMG_8513.jpg",
    alt: "Freshly paved commercial lot ready for striping and marking"
  },
];

export default function Services() {
  return (
    <section id="services" className="section-padding">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-title mb-4"
          >
            Our Paving Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-subtitle"
          >
            Comprehensive asphalt and concrete solutions for residential and commercial properties across the Tri-Cities.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card card-hover p-6 lg:p-8 flex flex-col h-full relative overflow-hidden group"
              >
                {/* Silver Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="h-12 w-12 rounded-lg bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-[rgb(var(--color-text))]">
                  {service.title}
                </h3>
                
                <p className="text-[rgb(var(--color-text-secondary))] mb-6 flex-grow">
                  {service.description}
                </p>
                
                <div className="mt-auto flex items-center text-sm font-medium text-[#DC2626] opacity-80 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
