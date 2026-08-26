"use client";

import { motion } from "framer-motion";
import { ThumbsUp, MessageCircle, Share2, ExternalLink, Facebook } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    date: "August 22, 2024",
    text: "Just wrapped up another big commercial lot in Johnson City! 🔥 Fresh asphalt, clean curbing, and ready for striping. This one was a 15,000 sq ft parking lot for a new retail space. The crew knocked it out in 2 days flat. #ABWOWPaving #TriCities #CommercialPaving",
    image: "/images/IMG_8475.jpg",
    likes: 47,
    comments: 12,
    shares: 5,
  },
  {
    id: 2,
    date: "August 18, 2024",
    text: "Nothing beats a smooth finish 💪 CAT roller doing its thing on a commercial project in Bristol. When we say quality, we mean it — every pass counts. Call us for your free estimate!",
    image: "/images/hero-banner.jpg",
    likes: 63,
    comments: 8,
    shares: 11,
  },
  {
    id: 3,
    date: "August 14, 2024",
    text: "The crew putting in work today! Hot asphalt going down on a new commercial build. Love seeing the steam rise on these summer days ☀️ If you need paving done right in the Tri-Cities, you know who to call. #PavingDoneRight #ABWOW",
    image: "/images/IMG_8466.jpg",
    likes: 89,
    comments: 21,
    shares: 14,
  },
  {
    id: 4,
    date: "August 8, 2024",
    text: "Before ➡️ After — Resurfaced this residential driveway in Kingsport last week. The homeowner couldn't believe the difference. That's the WOW factor we bring to every job! DM us or call (423) 555-7283 for a free quote.",
    image: "/images/IMG_8500.jpg",
    likes: 112,
    comments: 34,
    shares: 22,
  },
  {
    id: 5,
    date: "August 2, 2024",
    text: "Big roller, big results. 🚜 Commercial parking lot project coming together beautifully. ABWOW Paving — paving that makes you say WOW.",
    image: "/images/IMG_8450.jpg",
    likes: 56,
    comments: 9,
    shares: 7,
  },
  {
    id: 6,
    date: "July 28, 2024",
    text: "Another satisfied customer in Johnson City! 🏠 New driveway install — graded, paved, and rolled to perfection. This is what 10+ years of experience looks like. Thanks for trusting us with your home!",
    image: "/images/IMG_8513.jpg",
    likes: 74,
    comments: 16,
    shares: 9,
  },
];

export default function FacebookFeed() {
  return (
    <section className="section-padding bg-[rgb(var(--color-bg-secondary))]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1877F2]/10 text-[#1877F2] text-sm font-medium mb-6">
            <Facebook className="w-4 h-4" />
            Follow Us on Facebook
          </div>
          <h2 className="section-title">Latest From the Job Site</h2>
          <p className="section-subtitle mx-auto">
            See what we&apos;ve been up to. Real posts, real projects, real results.
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="card overflow-hidden flex flex-col"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  AB
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[rgb(var(--color-text))]">
                    Alan Bracken
                  </p>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">
                    {post.date} · <span className="text-[#1877F2]">🌐</span>
                  </p>
                </div>
                <Facebook className="w-5 h-5 text-[#1877F2] shrink-0" />
              </div>

              {/* Post Text */}
              <div className="px-4 pb-3">
                <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed line-clamp-4">
                  {post.text}
                </p>
              </div>

              {/* Post Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={post.image}
                  alt={`ABWOW Paving project - ${post.date}`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Reactions Bar */}
              <div className="px-4 py-2 flex items-center justify-between border-b border-[rgb(var(--color-border))]">
                <div className="flex items-center gap-1">
                  <span className="flex -space-x-1">
                    <span className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[10px]">👍</span>
                    <span className="w-5 h-5 rounded-full bg-[#F0284A] flex items-center justify-center text-white text-[10px]">❤️</span>
                  </span>
                  <span className="text-xs text-[rgb(var(--color-text-muted))] ml-1.5">{post.likes}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[rgb(var(--color-text-muted))]">
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-2 py-1 flex items-center justify-around">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  Like
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="https://www.facebook.com/alan.bracken1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1877F2] text-white font-semibold rounded-xl hover:bg-[#1565C0] transition-colors shadow-lg shadow-[#1877F2]/20"
          >
            <Facebook className="w-5 h-5" />
            Follow Us on Facebook
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-xs text-[rgb(var(--color-text-muted))] mt-3">
            Stay updated with our latest projects and special offers
          </p>
        </motion.div>
      </div>
    </section>
  );
}
