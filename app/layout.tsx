import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://drghahary.com/#person",
      name: "Dr. Ali Ghahary",
      honorificPrefix: "Dr.",
      honorificSuffix: "MD, CCFP",
      jobTitle: "Physician, Entrepreneur, Founder",
      description:
        "Physician, entrepreneur, and thought leader reimagining healthcare through ethical AI, interoperability, and patient empowerment.",
      url: "https://drghahary.com",
      sameAs: ["https://www.linkedin.com/in/alighahary", "https://knghtdoctrine.com"],
      alumniOf: [
        {
          "@type": "EducationalOrganization",
          name: "University of Alberta",
          description: "MD with honors",
        },
        {
          "@type": "EducationalOrganization",
          name: "McGill University",
          description: "CCFP",
        },
      ],
      knowsAbout: [
        "Healthcare Innovation",
        "Artificial Intelligence in Medicine",
        "Medical Ethics",
        "Telemedicine",
        "Clinical Documentation",
        "Patient Data Sovereignty",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://armadamd.com/#organization",
      name: "Armada MD",
      url: "https://armadamd.com",
      logo: "https://drghahary.com/images/ag-logo.svg",
      description: "Healthcare technology company focused on ethical AI, interoperability, and patient empowerment.",
      founder: {
        "@type": "Person",
        "@id": "https://drghahary.com/#person",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "info@armadamd.com",
        contactType: "General Inquiry",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Armada Housecall",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description:
        "A telehealth platform enabling physicians to deliver high-quality virtual care with integrated scheduling, documentation, and patient management.",
      url: "https://armadamd.com/housecall",
      brand: {
        "@type": "Organization",
        "@id": "https://armadamd.com/#organization",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Armada AssistMD",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description:
        "An AI-powered clinical documentation tool that helps physicians save time while maintaining accuracy and compliance in patient records.",
      url: "https://armadamd.com/assistmd",
      brand: {
        "@type": "Organization",
        "@id": "https://armadamd.com/#organization",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Armada ArkPass",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description:
        "A secure, patient-controlled health data platform enabling seamless sharing of medical records across providers and systems.",
      url: "https://armadamd.com/arkpass",
      brand: {
        "@type": "Organization",
        "@id": "https://armadamd.com/#organization",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://drghahary.com/#website",
      url: "https://drghahary.com",
      name: "Dr. Ali Ghahary",
      description:
        "Physician, entrepreneur, and founder reimagining healthcare through ethical AI, interoperability, and patient empowerment.",
      publisher: {
        "@type": "Person",
        "@id": "https://drghahary.com/#person",
      },
    },
  ],
}

export const metadata: Metadata = {
  title: "Dr. Ali Ghahary MD, CCFP | Physician, Entrepreneur, Founder | Armada MD",
  description:
    "Dr. Ali Ghahary is a physician, entrepreneur, and founder reimagining healthcare through ethical AI, interoperability, and patient empowerment. Founder of Armada Housecall™, AssistMD™, and ArkPass™.",
  keywords: [
    "Dr. Ali Ghahary",
    "Ali Ghahary MD",
    "Armada MD",
    "Armada Housecall",
    "telehealth platform",
    "virtual care",
    "AssistMD",
    "AI clinical assistant",
    "ArkPass",
    "patient data platform",
    "ethical AI healthcare",
    "healthcare interoperability",
    "patient empowerment",
    "KNGHT Doctrine",
    "physician entrepreneur",
    "healthcare innovation",
    "medical technology",
    "family physician",
    "CCFP",
  ],
  authors: [{ name: "Dr. Ali Ghahary" }],
  creator: "Dr. Ali Ghahary",
  publisher: "Armada MD",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drghahary.com",
    siteName: "Dr. Ali Ghahary",
    title: "Dr. Ali Ghahary MD, CCFP | Physician, Entrepreneur, Founder",
    description:
      "Reimagining healthcare through ethical AI, interoperability, and patient empowerment. Founder of Armada Housecall™, AssistMD™, and ArkPass™.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Ali Ghahary - Physician, Entrepreneur, Founder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Ali Ghahary MD, CCFP | Physician, Entrepreneur, Founder",
    description:
      "Reimagining healthcare through ethical AI, interoperability, and patient empowerment. Founder of Armada Housecall™, AssistMD™, and ArkPass™.",
    images: ["/og-image.jpg"],
    creator: "@drghahary",
  },
  alternates: {
    canonical: "https://drghahary.com",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/gnu1xpt.css" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
