"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function ServiceAreas() {
  const hubs = [
    {
      city: "Bristol",
      desc: "Providing top-tier driveway paving, commercial parking lots, and sealcoating for both Bristol TN and VA."
    },
    {
      city: "Johnson City",
      desc: "Expert asphalt repair, new installations, and line striping for homes and businesses throughout Johnson City."
    },
    {
      city: "Kingsport",
      desc: "Reliable paving solutions, from residential driveways to large commercial lots, built to last in Kingsport."
    }
  ];

  const additionalAreas = [
    "Elizabethton, TN", "Jonesborough, TN", "Erwin, TN", 
    "Gray, TN", "Bluff City, TN", "Church Hill, TN", 
    "Mount Carmel, TN", "Gate City, VA", "Abingdon, VA", "Bristol, VA"
  ];

  return (
    <section className="section-padding bg-[rgb(var(--color-bg-secondary))]">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-title">Proudly Serving the Tri-Cities & Beyond</h2>
          <p className="max-w-3xl mx-auto text-[rgb(var(--color-text-secondary))] mt-4">
            ABWOW Paving is your local, owner-operated paving expert serving Northeast Tennessee and Southwest Virginia. 
            Whether you need a new residential driveway in Johnson City or a commercial parking lot in Bristol, 
            Alan and his team deliver premium quality and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {hubs.map((hub, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className="card card-hover p-6 text-center border-t-4 border-t-[#C0C0C0]"
            >
              <MapPin className="w-8 h-8 text-[#DC2626] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-[rgb(var(--color-text))]">{hub.city}</h3>
              <p className="text-[rgb(var(--color-text-secondary))] text-sm">{hub.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="card p-8 bg-[rgb(var(--color-bg))]">
          <h3 className="text-lg font-semibold mb-6 text-center text-[rgb(var(--color-text))]">Additional Service Areas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {additionalAreas.map((area, index) => (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={index} 
                className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></div>
                {area}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
