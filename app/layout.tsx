import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://abwowpaving.com"),
  title: {
    default: "ABWOW Paving | Premier Asphalt Paving Contractor in the Tri-Cities TN",
    template: "%s | ABWOW Paving",
  },
  description:
    "ABWOW Paving is the Tri-Cities' premier asphalt paving contractor serving Bristol, Johnson City, Kingsport TN and beyond. Residential driveways, commercial parking lots, sealcoating & repairs. Get your free estimate today!",
  keywords: [
    "paving contractor tri-cities TN",
    "asphalt paving Bristol TN",
    "driveway paving Johnson City",
    "parking lot paving Kingsport",
    "asphalt contractor Tennessee",
    "residential paving tri-cities",
    "commercial paving Tennessee",
    "sealcoating tri-cities TN",
    "asphalt repair Bristol Johnson City Kingsport",
    "ABWOW Paving",
  ],
  authors: [{ name: "ABWOW Paving" }],
  creator: "ABWOW Paving",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abwowpaving.com",
    siteName: "ABWOW Paving",
    title: "ABWOW Paving | Premier Asphalt Paving in the Tri-Cities TN",
    description:
      "Tri-Cities' trusted asphalt paving contractor. Residential driveways, commercial parking lots, sealcoating & more. Free estimates!",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ABWOW Paving - Paving That Makes You Say WOW - Tri-Cities Tennessee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABWOW Paving | Paving That Makes You Say WOW.",
    description:
      "Tri-Cities' trusted asphalt paving contractor. Residential driveways, commercial parking lots & more. Free estimates!",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://abwowpaving.com",
  name: "ABWOW Paving",
  description:
    "Premier asphalt paving contractor serving the Tri-Cities area in Tennessee. Residential driveways, commercial parking lots, sealcoating, grading, and repairs.",
  url: "https://abwowpaving.com",
  telephone: "(423) 555-7283",
  email: "info@abwowpaving.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bristol",
    addressRegion: "TN",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "36.5951",
    longitude: "-82.1887",
  },
  areaServed: [
    { "@type": "City", name: "Bristol, TN" },
    { "@type": "City", name: "Johnson City, TN" },
    { "@type": "City", name: "Kingsport, TN" },
    { "@type": "City", name: "Bristol, VA" },
    { "@type": "City", name: "Elizabethton, TN" },
    { "@type": "City", name: "Jonesborough, TN" },
    { "@type": "City", name: "Erwin, TN" },
    { "@type": "City", name: "Gray, TN" },
    { "@type": "City", name: "Bluff City, TN" },
  ],
  openingHours: "Mo-Fr 07:00-18:00, Sa 08:00-14:00",
  priceRange: "$$",
  sameAs: [],
  founder: {
    "@type": "Person",
    name: "Alan Bracken",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Paving Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Residential Driveway Paving",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Commercial Parking Lot Paving",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Asphalt Sealcoating",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Grading & Site Preparation",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Asphalt Crack Repair",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Parking Lot Striping & Marking",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="font-body antialiased"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
