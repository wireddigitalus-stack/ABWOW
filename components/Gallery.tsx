"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

const galleryItems = [
  {
    type: "image" as const,
    src: "/images/hero-banner.jpg",
    alt: "CAT roller compacting fresh asphalt with Tennessee mountains in the background",
    caption: "Commercial parking lot paving",
  },
  {
    type: "video" as const,
    src: "/images/video-1.mp4",
    alt: "ABWOW Paving crew laying fresh asphalt on commercial project",
    caption: "Asphalt paving in action",
  },
  {
    type: "image" as const,
    src: "/images/IMG_8429.jpg",
    alt: "Weiler asphalt paver laying hot asphalt with steam rising on job site",
    caption: "Hot asphalt paving with Weiler paver",
  },
  {
    type: "image" as const,
    src: "/images/IMG_8475.jpg",
    alt: "Freshly paved commercial parking lot near Cavender's Boot City",
    caption: "Commercial parking lot project",
  },
  {
    type: "video" as const,
    src: "/images/video-2.mp4",
    alt: "Roller compacting fresh asphalt on commercial lot",
    caption: "Roller compaction process",
  },
  {
    type: "image" as const,
    src: "/images/IMG_8466.jpg",
    alt: "ABWOW Paving crew operating paver and roller with mountain backdrop",
    caption: "Our crew on the job",
  },
  {
    type: "image" as const,
    src: "/images/IMG_8450.jpg",
    alt: "CAT CB64B double drum roller at commercial construction site",
    caption: "CAT roller at commercial site",
  },
  {
    type: "video" as const,
    src: "/images/video-3.mp4",
    alt: "ABWOW Paving road paving project footage",
    caption: "Road paving project",
  },
  {
    type: "image" as const,
    src: "/images/IMG_8500.jpg",
    alt: "ABWOW crew operating paver with dump truck on scenic Tennessee road",
    caption: "Road paving with mountain views",
  },
  {
    type: "image" as const,
    src: "/images/IMG_8513.jpg",
    alt: "Close-up of ABWOW operator on CAT roller at commercial building site",
    caption: "Professional equipment operation",
  },
  {
    type: "video" as const,
    src: "/images/video-4.mp4",
    alt: "Asphalt paving operation footage from ABWOW Paving",
    caption: "Paving operation footage",
  },
  {
    type: "image" as const,
    src: "/images/IMG_8514.jpg",
    alt: "ABWOW Paving roller operator at commercial construction project",
    caption: "Commercial project in progress",
  },
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const goNext = () =>
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % galleryItems.length : 0
    );
  const goPrev = () =>
    setSelectedIndex((prev) =>
      prev !== null
        ? (prev - 1 + galleryItems.length) % galleryItems.length
        : 0
    );

  return (
    <>
      <section id="gallery" className="section-padding bg-[rgb(var(--color-bg))]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DC2626]/10 text-[#DC2626] text-sm font-medium mb-6">
              <Camera className="w-4 h-4" />
              Our Work
            </div>
            <h2 className="section-title">See Our Work in Action</h2>
            <p className="section-subtitle mx-auto">
              Real projects from real job sites across the Tri-Cities. Every photo and video is from our own crew.
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {galleryItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "100px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative group cursor-pointer overflow-hidden rounded-xl bg-[rgb(var(--color-card))] animate-pulse ${
                  index === 0 || index === 3
                    ? "col-span-2 row-span-2 aspect-square md:aspect-[4/3]"
                    : "aspect-square"
                }`}
                onClick={() => openLightbox(index)}
              >
                {item.type === "image" ? (
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    onLoad={(e) => e.currentTarget.parentElement?.classList.remove('animate-pulse')}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={item.src}
                      muted
                      loop
                      playsInline
                      preload="none"
                      autoPlay
                      onLoadedData={(e) => e.currentTarget.parentElement?.parentElement?.classList.remove('animate-pulse')}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#DC2626]/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                  <div className="p-3 md:p-4 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs md:text-sm font-medium">{item.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Content */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[85vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryItems[selectedIndex].type === "image" ? (
                <img
                  src={galleryItems[selectedIndex].src}
                  alt={galleryItems[selectedIndex].alt}
                  className="w-full h-full max-h-[80vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={galleryItems[selectedIndex].src}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[80vh] rounded-lg"
                />
              )}
              <p className="text-white/70 text-sm text-center mt-3">
                {galleryItems[selectedIndex].caption} — {selectedIndex + 1} / {galleryItems.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
