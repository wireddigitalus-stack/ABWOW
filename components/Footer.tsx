"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 text-center md:text-left">
          
          {/* Column 1: Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tighter">
                AB<span className="text-[#DC2626]">WOW</span> PAVING
              </span>
            </Link>
            <p className="text-sm font-semibold text-[#DC2626] mb-3">Tri-Cities&apos; Premier Paving Contractor</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Owner-operated paving company dedicated to providing high-quality residential and commercial asphalt services with a personal touch.
            </p>
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <a href="https://www.facebook.com/alan.bracken1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#DC2626] transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#DC2626] transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Our Services</h3>
            <ul className="space-y-3">
              {[
                "Residential Paving",
                "Commercial Paving",
                "Asphalt Repair",
                "Sealcoating",
                "Line Striping",
                "Tar & Chip"
              ].map((service, i) => (
                <li key={i}>
                  <Link href="#services" className="text-gray-400 hover:text-[#DC2626] text-sm transition-colors inline-flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#DC2626]"></div>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Service Areas */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Service Areas</h3>
            <ul className="space-y-3">
              {[
                "Bristol, TN & VA",
                "Johnson City, TN",
                "Kingsport, TN",
                "Elizabethton, TN",
                "Jonesborough, TN",
                "Abingdon, VA"
              ].map((area, i) => (
                <li key={i}>
                  <Link href="#service-areas" className="text-gray-400 hover:text-[#DC2626] text-sm transition-colors inline-flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#DC2626]"></div>
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:4235557283" className="inline-flex items-center gap-3 text-gray-400 hover:text-[#DC2626] transition-colors group">
                  <Phone className="w-5 h-5 text-[#DC2626] group-hover:scale-110 transition-transform" />
                  <span className="text-sm">(423) 555-7283</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@abwowpaving.com" className="inline-flex items-center gap-3 text-gray-400 hover:text-[#DC2626] transition-colors group">
                  <Mail className="w-5 h-5 text-[#DC2626] group-hover:scale-110 transition-transform" />
                  <span className="text-sm">info@abwowpaving.com</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-[#DC2626] shrink-0" />
                <span className="text-sm">Tri-Cities Area<br/>Bristol · Johnson City · Kingsport</span>
              </li>
              <li className="inline-flex items-center gap-3 text-gray-400">
                <Clock className="w-5 h-5 text-[#DC2626] shrink-0" />
                <span className="text-sm">Mon-Fri: 7AM - 6PM<br/>Sat: By Appointment</span>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-xs text-gray-500">
            Copyright &copy; {new Date().getFullYear()} ABWOW Paving. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
