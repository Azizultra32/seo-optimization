"use client"

import Image from "next/image"
import { ExternalLink, Shield, Lock, CheckCircle, Award } from "lucide-react"
import { useEffect, useRef } from "react"
import { trackEvent, trackScrollDepth, trackPerformance } from "@/lib/analytics"
import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"
import { AnimatedCounter } from "@/components/animated-counter"
import { HousecallDemo, AssistMDDemo, ArkPassDemo } from "@/components/product-demo-dialog"
// import { PersonalizedBanner } from "@/components/personalized-banner"
// import { PersonalizedCTA } from "@/components/personalized-cta"
// import { usePersonalization, getPersonalizedContent } from "@/lib/personalization"

export default function DrGhaharyPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll()

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  const aboutRef = useInView({ threshold: 0.2 })
  const projectsRef = useInView({ threshold: 0.1 })
  const trustRef = useInView({ threshold: 0.2 })
  const ethicalRef = useInView({ threshold: 0.3 })
  const contactRef = useInView({ threshold: 0.3 })

  // const { profile } = usePersonalization()
  // const personalizedContent = getPersonalizedContent(profile.type)

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("[v0] Video autoplay prevented:", error)
      })
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
    }

    trackPerformance()
    const cleanupScroll = trackScrollDepth()

    // Track page view
    trackEvent("page_view", "homepage")

    return () => {
      if (cleanupScroll) cleanupScroll()
    }
  }, [])

  const handleCTAClick = (ctaName: string) => {
    trackEvent("cta_click", ctaName)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* <PersonalizedBanner /> */}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                  "Physician, entrepreneur, and thought leader reimagining healthcare on a global scale with over 20 years of clinical experience.",
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
                url: "https://drghahary.com",
                sameAs: ["https://www.linkedin.com/in/alighahary", "https://knghtdoctrine.com"],
              },
              {
                "@type": "Organization",
                "@id": "https://armadamd.com/#organization",
                name: "Armada MD",
                founder: {
                  "@id": "https://drghahary.com/#person",
                },
                description:
                  "Healthcare technology company focused on ethical AI, interoperability, and patient empowerment.",
                url: "https://armadamd.com",
              },
              {
                "@type": "SoftwareApplication",
                name: "Armada Housecall",
                applicationCategory: "HealthApplication",
                operatingSystem: "Web",
                description:
                  "A telehealth platform enabling physicians to deliver high-quality virtual care with integrated scheduling, documentation, and patient management.",
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
                name: "Dr. Ali Ghahary - Healthcare Innovation",
                description:
                  "Physician, entrepreneur, and thought leader reimagining healthcare through ethical AI and patient-centered technology.",
                publisher: {
                  "@id": "https://drghahary.com/#person",
                },
              },
            ],
          }),
        }}
      />

      {/* Hero Section with DNA Video Background */}
      <section className="relative min-h-screen w-full overflow-hidden bg-white">
        <div className="fixed top-0 left-0 w-full h-screen opacity-40 z-0">
          <motion.video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            poster="/images/dna-helix-background.jpeg"
            disablePictureInPicture
            disableRemotePlayback
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoLoad}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3watermarked_preview-Bk5N138nsMFSjnIXU2MYPxuk7C2dB7.mp4" type="video/mp4" />
          </motion.video>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <motion.header
            className="px-6 py-5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex justify-center mb-4">
              <h2 className="hidden md:block font-ivyjournal font-normal text-black text-xs md:text-sm whitespace-nowrap">
                ( DR. ALI GHAHARY )
              </h2>
            </div>

            <div className="flex items-center justify-between">
              <motion.button
                className="logo-hover transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/images/ag-logo.svg" alt="AG Logo" width={120} height={40} className="h-10 w-auto" />
              </motion.button>
            </div>
          </motion.header>

          {/* Hero Content */}
          <motion.div
            className="flex min-h-screen items-center justify-center px-6"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <motion.div
              className="text-center flex flex-col items-center"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp} className="text-black text-base font-light mb-3">
                +
              </motion.div>
              <motion.div variants={fadeInUp} className="w-px h-20 bg-black/30 mb-6" />
              <motion.div variants={fadeInUp} className="text-black text-base font-light mb-6">
                +
              </motion.div>

              <motion.div
                variants={scaleIn}
                className="border border-black px-5 py-1.5 rounded-full mb-12 bg-white/80 backdrop-blur-sm"
              >
                <p className="font-alfabet font-normal text-black text-[10px] md:text-xs tracking-wider">
                  HEALTHCARE INNOVATION
                </p>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-ivyjournal text-black text-4xl max-w-[740px] leading-tight mb-4 tracking-wide md:text-6xl font-thin"
              >
                <span className="font-normal">Dr. Ali Ghahary</span> <span className="font-thin">MD, CCFP</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="font-alfabet text-black text-base md:text-lg mb-10 font-normal">
                Physician · Entrepreneur · Founder
              </motion.p>

              <motion.div variants={fadeInUp} className="text-black text-base font-light mb-3">
                +
              </motion.div>
              <motion.div variants={fadeInUp} className="w-px h-20 bg-black/30" />
              <motion.div variants={fadeInUp} className="text-black text-base font-light mt-3">
                +
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-20 bg-white py-16 md:py-24" ref={aboutRef.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex justify-start mb-16"
            initial={{ opacity: 0, x: -30 }}
            animate={aboutRef.isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-alfabet font-normal text-black text-[10px] md:text-xs border border-black px-5 py-1.5 rounded-full uppercase">
              ABOUT
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16"
            variants={staggerContainer}
            initial="hidden"
            animate={aboutRef.isInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeInUp}>
              <h2 className="font-ivyjournal italic font-normal text-black text-4xl md:text-5xl mb-6">
                Reimagining Healthcare on a Global Scale
              </h2>
              <p className="font-alfabet font-light text-black text-base md:text-lg leading-relaxed mb-4">
                Dr. Ali Ghahary is a physician, entrepreneur, and thought leader reimagining healthcare on a global
                scale. As a board-certified general practitioner (CCFP) with over 20 years of front-line clinical
                experience, he combines deep medical expertise with a passion for innovation and ethical technology
                development.
              </p>
              <p className="font-alfabet font-light text-black text-base md:text-lg leading-relaxed mb-4">
                He earned his Doctor of Medicine (MD) with honors from the University of Alberta and completed his
                Certification in the College of Family Physicians (CCFP) at McGill University. Throughout his career, he
                has treated thousands of patients while pioneering new approaches to healthcare delivery through
                technology.
              </p>
              <p className="font-alfabet font-light text-black text-base md:text-lg leading-relaxed mb-4">
                In 2024, he presented his seminal work on AI ethics and implications to the future of healthcare, "The
                KNGHT Doctrine," at the World Economic Forum in Davos, Switzerland. This framework for ethical AI in
                medicine remains the focus of his research and advocacy work.
              </p>
              <p className="font-alfabet font-light text-black text-base md:text-lg leading-relaxed mb-4">
                Dr. Ghahary is also an actor, filmmaker, and executive producer. He is currently the founder and CEO of
                Damavand Pictures, where he explores the intersection of storytelling and healthcare innovation.
              </p>
              <p className="font-alfabet font-light text-black/50 text-xs mt-6">Last updated: January 2025</p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h3 className="font-alfabet font-normal text-black text-xs md:text-sm uppercase mb-4">MISSION</h3>
              <p className="font-alfabet font-light text-black text-base md:text-lg leading-relaxed mb-8">
                To bridge the gap between cutting-edge technology and compassionate care, ensuring that innovation
                serves humanity—not the other way around.
              </p>

              <h3 className="font-alfabet font-normal text-black text-xs md:text-sm uppercase mb-4">CORE VALUES</h3>
              <ul className="space-y-2 font-alfabet font-light text-black text-base leading-relaxed">
                <li className="flex gap-2">
                  <span className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0" />
                  <span>Technological Parity in Healthcare</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0" />
                  <span>Innovation Productivity Imperative</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0" />
                  <span>Patient-Centricity</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0" />
                  <span>Clinician-Centricity</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0" />
                  <span>Data Sovereignty</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0" />
                  <span>Public Trust</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0" />
                  <span>The Hippocratic Oath</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0" />
                  <span>Ethics in AI</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0" />
                  <span>Compliance: Above & Beyond</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 w-1 h-1 bg-black rounded-full flex-shrink-0" />
                  <span>Global Collaboration</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="relative z-30 bg-[#3a3632] py-16 md:py-24" id="projects" ref={projectsRef.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex justify-start mb-16"
            initial={{ opacity: 0, x: -30 }}
            animate={projectsRef.isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-alfabet font-normal text-white text-[10px] md:text-xs border border-white px-5 py-1.5 rounded-full uppercase">
              PROJECTS
            </div>
          </motion.div>

          <motion.div
            className="space-y-16"
            variants={staggerContainer}
            initial="hidden"
            animate={projectsRef.isInView ? "visible" : "hidden"}
          >
            {/* Armada Housecall */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="font-alfabet font-normal text-white text-xs md:text-sm uppercase mb-2">
                  ARMADA HOUSECALL<sup className="text-[8px]">™</sup>
                </h3>
                <p className="font-alfabet font-normal text-white text-xs md:text-sm uppercase mb-6">
                  VIRTUAL CARE PLATFORM
                </p>
              </div>

              <div>
                <p className="font-alfabet font-light text-white text-base md:text-lg leading-relaxed mb-4">
                  A comprehensive telehealth platform enabling physicians to deliver high-quality virtual care with
                  integrated scheduling, clinical documentation, secure video consultations, and patient management.
                  Designed by physicians for physicians, Armada Housecall maintains the quality of in-person care while
                  expanding access to underserved communities.
                </p>
                <HousecallDemo />
              </div>
            </motion.div>

            {/* Armada AssistMD */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="font-alfabet font-normal text-white text-xs md:text-sm uppercase mb-2">
                  ARMADA ASSISTMD<sup className="text-[8px]">™</sup>
                </h3>
                <p className="font-alfabet font-normal text-white text-xs md:text-sm uppercase mb-6">
                  AI CLINICAL ASSISTANT
                </p>
              </div>

              <div>
                <p className="font-alfabet font-light text-white text-base md:text-lg leading-relaxed mb-4">
                  An AI-powered clinical documentation assistant that helps physicians save time while maintaining
                  accuracy, compliance, and the human touch in patient records. Built on ethical AI principles, AssistMD
                  augments—never replaces—clinical judgment, allowing physicians to focus more time on patient care and
                  less on administrative burden.
                </p>
                <AssistMDDemo />
              </div>
            </motion.div>

            {/* Armada ArkPass */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="font-alfabet font-normal text-white text-xs md:text-sm uppercase mb-2">
                  ARMADA ARKPASS<sup className="text-[8px]">™</sup>
                </h3>
                <p className="font-alfabet font-normal text-white text-xs md:text-sm uppercase mb-6">
                  PATIENT DATA PLATFORM
                </p>
              </div>

              <div>
                <p className="font-alfabet font-light text-white text-base md:text-lg leading-relaxed mb-4">
                  A secure, patient-controlled health data platform enabling seamless sharing of medical records across
                  providers and systems. ArkPass puts patients in control of their own health data, ensuring privacy,
                  portability, and interoperability while maintaining the highest standards of security and HIPAA
                  compliance.
                </p>
                <ArkPassDemo />
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-16 pt-8 border-t border-white/20">
            <p className="font-alfabet font-light text-white/60 text-xs leading-relaxed max-w-4xl">
              <strong className="text-white/80">Medical Disclaimer:</strong> The information provided about these
              healthcare technology products is for informational purposes only. These tools are designed to assist
              healthcare professionals and should not replace clinical judgment, professional medical advice, or the
              patient-physician relationship. Always consult with qualified healthcare providers for medical decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Principles Section */}
      <section className="bg-white py-16 md:py-24 border-y border-black/10" ref={trustRef.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex justify-start mb-12"
            initial={{ opacity: 0, x: -30 }}
            animate={trustRef.isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-alfabet font-normal text-black text-[10px] md:text-xs border border-black px-5 py-1.5 rounded-full uppercase">
              SECURITY & PRINCIPLES
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
            variants={staggerContainer}
            initial="hidden"
            animate={trustRef.isInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeInUp}>
              <h2 className="font-ivyjournal italic font-normal text-black text-3xl md:text-4xl mb-6">
                Built with Security & Trust at the Core
              </h2>
              <p className="font-alfabet font-light text-black text-sm md:text-base leading-relaxed">
                Every Armada MD product is designed with patient safety, data security, and ethical principles at its
                foundation. We are committed to the highest standards of healthcare technology security and continuously
                invest in protecting patient information.
              </p>
            </motion.div>

            <motion.div className="grid grid-cols-2 gap-6" variants={staggerContainer}>
              <motion.div
                variants={scaleIn}
                className="flex flex-col items-center text-center p-6 border border-black/10 rounded-lg hover:border-black/30 hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <Shield className="w-8 h-8 text-black mb-3" />
                <h3 className="font-alfabet font-normal text-black text-xs uppercase mb-2">HIPAA Standards</h3>
                <p className="font-alfabet font-light text-black/60 text-xs">Built to healthcare privacy regulations</p>
              </motion.div>

              <motion.div
                variants={scaleIn}
                className="flex flex-col items-center text-center p-6 border border-black/10 rounded-lg hover:border-black/30 hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <Lock className="w-8 h-8 text-black mb-3" />
                <h3 className="font-alfabet font-normal text-black text-xs uppercase mb-2">Security Controls</h3>
                <p className="font-alfabet font-light text-black/60 text-xs">Enterprise-grade security architecture</p>
              </motion.div>

              <motion.div
                variants={scaleIn}
                className="flex flex-col items-center text-center p-6 border border-black/10 rounded-lg hover:border-black/30 hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <CheckCircle className="w-8 h-8 text-black mb-3" />
                <h3 className="font-alfabet font-normal text-black text-xs uppercase mb-2">Data Encryption</h3>
                <p className="font-alfabet font-light text-black/60 text-xs">Bank-level encryption for patient data</p>
              </motion.div>

              <motion.div
                variants={scaleIn}
                className="flex flex-col items-center text-center p-6 border border-black/10 rounded-lg hover:border-black/30 hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <Award className="w-8 h-8 text-black mb-3" />
                <h3 className="font-alfabet font-normal text-black text-xs uppercase mb-2">Best Practices</h3>
                <p className="font-alfabet font-light text-black/60 text-xs">
                  Following international security standards
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Trust Indicators with Animated Counters */}
          <motion.div
            className="pt-8 border-t border-black/10"
            initial={{ opacity: 0 }}
            animate={trustRef.isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-wrap gap-8 justify-center items-center">
              <div className="text-center">
                <p className="font-alfabet font-normal text-black text-2xl mb-1">
                  <AnimatedCounter end={20} suffix="+" shouldStart={trustRef.isInView} />
                </p>
                <p className="font-alfabet font-light text-black/60 text-xs uppercase">Years Experience</p>
              </div>
              <div className="w-px h-12 bg-black/10" />
              <div className="text-center">
                <p className="font-alfabet font-normal text-black text-2xl mb-1">
                  <AnimatedCounter end={100} suffix="%" shouldStart={trustRef.isInView} />
                </p>
                <p className="font-alfabet font-light text-black/60 text-xs uppercase">Data Sovereignty</p>
              </div>
              <div className="w-px h-12 bg-black/10" />
              <div className="text-center">
                <p className="font-alfabet font-normal text-black text-2xl mb-1">24/7</p>
                <p className="font-alfabet font-light text-black/60 text-xs uppercase">Security Focus</p>
              </div>
              <div className="w-px h-12 bg-black/10" />
              <div className="text-center">
                <p className="font-alfabet font-normal text-black text-2xl mb-1">Ethical</p>
                <p className="font-alfabet font-light text-black/60 text-xs uppercase">AI Principles</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ethical AI Section */}
      <section className="bg-neutral-50 py-16 md:py-24" ref={ethicalRef.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={ethicalRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-alfabet font-normal text-black text-[10px] md:text-xs border border-black px-5 py-1.5 rounded-full uppercase bg-white/90 backdrop-blur-sm">
              ETHICAL AI IN HEALTHCARE
            </div>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={ethicalRef.isInView ? "visible" : "hidden"}
          >
            <motion.h2
              variants={fadeInUp}
              className="font-ivyjournal italic font-normal text-black text-4xl md:text-5xl mb-6 text-center"
            >
              Building Trust Through Transparency
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="font-alfabet font-light text-black text-base md:text-lg leading-relaxed text-center mb-8"
            >
              Dr. Ghahary believes that AI in healthcare must be built on a foundation of ethical principles,
              transparency, and patient-centered design. Technology should augment—not replace—the human connection at
              the heart of medicine.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex justify-center">
              <motion.a
                href="https://knghtdoctrine.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-alfabet font-normal text-black text-xs md:text-sm border border-black px-5 py-2 rounded-full hover:bg-black hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Learn more about The KNGHT Doctrine</span>
                <ExternalLink className="w-3 h-3" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#f8f8f8] py-16 md:py-24" ref={contactRef.ref}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={contactRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-alfabet font-normal text-black text-[10px] md:text-xs border border-black px-5 py-1.5 rounded-full uppercase bg-white/90 backdrop-blur-sm">
              CONTACT
            </div>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={contactRef.isInView ? "visible" : "hidden"}
          >
            <motion.h2
              variants={fadeInUp}
              className="font-ivyjournal italic font-normal text-black text-4xl md:text-5xl mb-4 text-center"
            >
              Get in Touch
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="font-alfabet font-light text-black/60 text-base md:text-lg text-center mb-12"
            >
              Whether you're interested in our products, media inquiries, or general questions, we'd love to hear from
              you.
            </motion.p>

            {/* Contact Options Grid */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" variants={staggerContainer}>
              <motion.div
                variants={scaleIn}
                className="border border-black/10 rounded-lg p-6 hover:border-black/30 hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <h3 className="font-alfabet font-normal text-black text-sm uppercase mb-2">General Inquiries</h3>
                <p className="font-alfabet font-light text-black/60 text-xs mb-4">
                  Questions about Dr. Ghahary or Armada MD
                </p>
                <a
                  href="mailto:info@armadamd.com"
                  onClick={() => handleCTAClick("email_general")}
                  className="font-alfabet font-normal text-black text-xs hover:opacity-60 transition-opacity"
                >
                  info@armadamd.com
                </a>
              </motion.div>

              <motion.div
                variants={scaleIn}
                className="border border-black/10 rounded-lg p-6 hover:border-black/30 hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <h3 className="font-alfabet font-normal text-black text-sm uppercase mb-2">Product Demo</h3>
                <p className="font-alfabet font-light text-black/60 text-xs mb-4">
                  Request a demo of our healthcare platforms
                </p>
                <a
                  href="mailto:demo@armadamd.com"
                  onClick={() => handleCTAClick("email_demo")}
                  className="font-alfabet font-normal text-black text-xs hover:opacity-60 transition-opacity"
                >
                  demo@armadamd.com
                </a>
              </motion.div>

              <motion.div
                variants={scaleIn}
                className="border border-black/10 rounded-lg p-6 hover:border-black/30 hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <h3 className="font-alfabet font-normal text-black text-sm uppercase mb-2">Press & Media</h3>
                <p className="font-alfabet font-light text-black/60 text-xs mb-4">
                  Media inquiries and interview requests
                </p>
                <a
                  href="mailto:press@armadamd.com"
                  onClick={() => handleCTAClick("email_press")}
                  className="font-alfabet font-normal text-black text-xs hover:opacity-60 transition-opacity"
                >
                  press@armadamd.com
                </a>
              </motion.div>

              <motion.div
                variants={scaleIn}
                className="border border-black/10 rounded-lg p-6 hover:border-black/30 hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <h3 className="font-alfabet font-normal text-black text-sm uppercase mb-2">Partnerships</h3>
                <p className="font-alfabet font-light text-black/60 text-xs mb-4">
                  Collaboration and partnership opportunities
                </p>
                <a
                  href="mailto:partnerships@armadamd.com"
                  onClick={() => handleCTAClick("email_partnerships")}
                  className="font-alfabet font-normal text-black text-xs hover:opacity-60 transition-opacity"
                >
                  partnerships@armadamd.com
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <motion.a
                href="mailto:demo@armadamd.com?subject=Demo Request"
                className="inline-flex items-center gap-2 font-alfabet font-normal text-xs md:text-sm px-6 py-3 rounded-full bg-black text-white hover:bg-black/80 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCTAClick("email_demo")}
              >
                Request Demo
              </motion.a>
              <motion.a
                href="#projects"
                className="inline-flex items-center gap-2 font-alfabet font-normal text-xs md:text-sm px-6 py-3 rounded-full border border-black text-black hover:bg-black hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.a>
            </motion.div>

            {/* LinkedIn CTA */}
            <motion.div variants={fadeInUp} className="text-center">
              <motion.a
                href="https://www.linkedin.com/in/alighahary"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCTAClick("linkedin")}
                className="inline-flex items-center gap-2 font-alfabet font-normal text-black text-xs md:text-sm border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Connect on LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f8f8f8] py-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About Column */}
            <div>
              <h3 className="font-alfabet font-normal text-black text-xs uppercase mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    Dr. Ali Ghahary
                  </a>
                </li>
                <li>
                  <a
                    href="https://knghtdoctrine.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    The KNGHT Doctrine
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    Damavand Pictures
                  </a>
                </li>
              </ul>
            </div>

            {/* Products Column */}
            <div>
              <h3 className="font-alfabet font-normal text-black text-xs uppercase mb-4">Products</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#projects"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    Armada Housecall™
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    Armada AssistMD™
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    Armada ArkPass™
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="font-alfabet font-normal text-black text-xs uppercase mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/medical-disclaimer"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    Medical Disclaimer
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/hipaa-compliance"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div>
              <h3 className="font-alfabet font-normal text-black text-xs uppercase mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:info@armadamd.com"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    info@armadamd.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/alighahary"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-alfabet font-light text-black/60 text-xs hover:text-black transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-alfabet font-light text-black/60 text-xs">
              © {new Date().getFullYear()} Dr. Ali Ghahary. All rights reserved.
            </p>
            <p className="font-alfabet font-light text-black/60 text-xs">
              Built with ethical AI principles · Armada MD
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
