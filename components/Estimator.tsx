"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Building2, Route, HelpCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { addEstimate } from "@/lib/store";

const jobTypes = [
  { id: "residential", label: "Residential Driveway", icon: Home },
  { id: "commercial", label: "Commercial Parking Lot", icon: Building2 },
  { id: "road", label: "Road/Private Road", icon: Route },
  { id: "other", label: "Other/Custom", icon: HelpCircle },
];

const presets = [
  { label: "Small ~500 sq ft", value: 500 },
  { label: "Medium ~1500 sq ft", value: 1500 },
  { label: "Large ~3000 sq ft", value: 3000 },
  { label: "XL ~5000+ sq ft", value: 5000 },
];

const pricingLogic: Record<string, { min: number; max: number }> = {
  "New Installation": { min: 3, max: 5 },
  "Resurfacing/Overlay": { min: 2, max: 3.5 },
  "Repair/Patching": { min: 1.5, max: 3 },
  Sealcoating: { min: 0.5, max: 1.5 },
};

export default function Estimator() {
  const [step, setStep] = useState(1);
  const [jobType, setJobType] = useState("");
  const [serviceType, setServiceType] = useState("New Installation");
  const [area, setArea] = useState<number | "">("");
  const [contact, setContact] = useState({ name: "", email: "", phone: "", address: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => setStep((p) => Math.min(p + 1, 4));
  const handleBack = () => setStep((p) => Math.max(p - 1, 1));

  const calculateEstimate = () => {
    const rate = pricingLogic[serviceType] || { min: 0, max: 0 };
    const sqft = Number(area) || 0;
    return {
      min: rate.min * sqft,
      max: rate.max * sqft,
    };
  };

  const estimate = calculateEstimate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEstimate({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      jobType,
      serviceType,
      area: Number(area),
      areaUnit: "sq ft",
      estimatedCost: `$${estimate.min.toLocaleString()} — $${estimate.max.toLocaleString()}`,
    });
    setSubmitted(true);
  };

  const slideVariants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <section id="estimator" className="section-padding bg-[rgb(var(--color-bg-secondary))]">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-title">
            Get Your <span className="gold-gradient-text">Instant</span> Estimate
          </h2>
          <p className="section-subtitle mt-4 max-w-2xl mx-auto">
            Answer a few questions and get a ballpark estimate for your paving project in seconds.
          </p>
        </div>

        <div className="max-w-3xl mx-auto card p-6 md:p-8">
          {/* Progress Bar */}
          <div className="w-full bg-[rgb(var(--color-border))] h-2 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="bg-[#DC2626] h-full"
              initial={{ width: "25%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="min-h-[350px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold mb-4">What type of project is this?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = jobType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setJobType(type.id)}
                          className={`p-6 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${
                            isSelected
                              ? "border-[#DC2626] bg-[rgb(var(--color-card))]"
                              : "border-[rgb(var(--color-border))] hover:border-[#DC2626]/50"
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${isSelected ? "text-[#DC2626]" : "text-[rgb(var(--color-text-muted))]"}`} />
                          <span className="font-medium">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold mb-4">Project Details</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Needed</label>
                    <select
                      className="input-field w-full"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      {Object.keys(pricingLogic).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Approximate Area (Sq Ft)</label>
                    <input
                      type="number"
                      className="input-field w-full mb-4"
                      placeholder="e.g., 1500"
                      value={area}
                      onChange={(e) => setArea(e.target.value ? Number(e.target.value) : "")}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => setArea(preset.value)}
                          className="btn-ghost text-sm py-2 px-3 border border-[rgb(var(--color-border))] rounded-lg"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold mb-4">Your Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="input-field w-full"
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          className="input-field w-full"
                          value={contact.email}
                          onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone *</label>
                        <input
                          type="tel"
                          required
                          className="input-field w-full"
                          value={contact.phone}
                          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Project Address *</label>
                      <input
                        type="text"
                        required
                        className="input-field w-full"
                        value={contact.address}
                        onChange={(e) => setContact({ ...contact, address: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6 text-center"
                >
                  {submitted ? (
                    <div className="py-12">
                      <h3 className="text-2xl font-bold mb-4 text-[#DC2626]">Quote Requested!</h3>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-8">
                        Thank you, {contact.name}. We've received your request and will be in touch shortly to schedule an on-site visit.
                      </p>
                      <button onClick={() => window.location.reload()} className="btn-secondary">
                        Start Over
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-6">Your Estimated Cost</h3>
                      <div className="bg-[rgb(var(--color-bg))] p-8 rounded-2xl border border-[#DC2626]/30 inline-block w-full max-w-md">
                        <p className="text-4xl font-bold gold-gradient-text mb-2">
                          ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-muted))]">
                          Based on {area} sq ft of {serviceType}
                        </p>
                      </div>
                      <p className="text-sm text-[rgb(var(--color-text-muted))] italic mt-4 mb-8">
                        This is a rough ballpark estimate. Contact us for an accurate, free on-site quote.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={handleSubmit} className="btn-primary">
                          Request Detailed Quote
                        </button>
                        <a href="tel:4235557283" className="btn-secondary text-center">
                          Call Us Now
                        </a>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-[rgb(var(--color-border))]">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center gap-2 ${step === 1 ? "opacity-0 pointer-events-none" : "btn-ghost"}`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !jobType) ||
                  (step === 2 && !area) ||
                  (step === 3 && (!contact.name || !contact.email || !contact.phone || !contact.address))
                }
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
