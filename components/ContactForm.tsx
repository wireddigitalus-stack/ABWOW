"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin, CheckCircle } from "lucide-react";
import { addLead } from "@/lib/store";

type FormData = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  service: string;
  message: string;
};

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    addLead({
      ...data,
      source: "contact",
    });
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="section-padding">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle mt-4 max-w-2xl mx-auto">
            Ready to upgrade your pavement? Contact ABWOW Paving today for a free, no-obligation estimate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-6 md:p-8"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-[rgb(var(--color-text-secondary))]">
                  Thanks for reaching out. Alan will get back to you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    {...register("name", { required: true })}
                    className="input-field w-full"
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-red-500 text-sm mt-1">Name is required</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                      className="input-field w-full"
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="text-red-500 text-sm mt-1">Valid email is required</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      {...register("phone", { required: true })}
                      className="input-field w-full"
                      placeholder="(423) 555-0000"
                    />
                    {errors.phone && <span className="text-red-500 text-sm mt-1">Phone is required</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    {...register("address")}
                    className="input-field w-full"
                    placeholder="123 Main St, Johnson City, TN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Needed</label>
                  <select {...register("service")} className="input-field w-full">
                    <option value="">Select a service...</option>
                    <option value="Residential Driveway">Residential Driveway</option>
                    <option value="Commercial Parking Lot">Commercial Parking Lot</option>
                    <option value="Sealcoating">Sealcoating</option>
                    <option value="Grading">Grading</option>
                    <option value="Repairs">Repairs</option>
                    <option value="Lot Marking">Lot Marking</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    {...register("message")}
                    className="input-field w-full min-h-[120px] resize-y"
                    placeholder="Tell us a bit about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-70"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right: Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="card-hover p-6 rounded-2xl flex items-start gap-4 bg-[rgb(var(--color-card))]">
              <div className="p-3 bg-[#DC2626]/10 rounded-xl text-[#DC2626]">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1">Call Us Directly</h4>
                <a href="tel:4235557283" className="text-[rgb(var(--color-text-secondary))] hover:text-[#DC2626] transition-colors">
                  (423) 555-7283
                </a>
              </div>
            </div>

            <div className="card-hover p-6 rounded-2xl flex items-start gap-4 bg-[rgb(var(--color-card))]">
              <div className="p-3 bg-[#DC2626]/10 rounded-xl text-[#DC2626]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1">Email Us</h4>
                <a href="mailto:info@abwowpaving.com" className="text-[rgb(var(--color-text-secondary))] hover:text-[#DC2626] transition-colors">
                  info@abwowpaving.com
                </a>
              </div>
            </div>

            <div className="card-hover p-6 rounded-2xl flex items-start gap-4 bg-[rgb(var(--color-card))]">
              <div className="p-3 bg-[#DC2626]/10 rounded-xl text-[#DC2626]">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1">Business Hours</h4>
                <p className="text-[rgb(var(--color-text-secondary))]">Mon-Fri: 7:00 AM - 6:00 PM</p>
                <p className="text-[rgb(var(--color-text-secondary))]">Sat: 8:00 AM - 2:00 PM</p>
              </div>
            </div>

            <div className="card-hover p-6 rounded-2xl flex items-start gap-4 bg-[rgb(var(--color-card))]">
              <div className="p-3 bg-[#DC2626]/10 rounded-xl text-[#DC2626]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1">Service Area</h4>
                <p className="text-[rgb(var(--color-text-secondary))]">
                  Tri-Cities TN (Bristol, Johnson City, Kingsport) and surrounding areas.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
