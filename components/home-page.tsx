"use client"

import Image from "next/image"
import { ExternalLink, Shield, Lock, CheckCircle, Award, ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"
import { trackEvent, trackPerformance } from "@/lib/analytics"
import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"
import { AnimatedCounter } from "@/components/animated-counter"
import { HousecallDemo, AssistMDDemo, ArkPassDemo } from "@/components/product-demo-dialog"

export function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll()

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const textParallax = useTransform(scrollYProgress, [0, 0.5], [0, -50])

  const aboutRef = useInView({ threshold: 0.2 })
  const projectsRef = useInView({ threshold: 0.1 })
  const trustRef = useInView({ threshold: 0.2 })
  const ethicalRef = useInView({ threshold: 0.3 })
  const contactRef = useInView({ threshold: 0.3 })

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8
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
    // Track page view
    trackEvent("page_view", "homepage")

    return () => {
      // No cleanup needed since tracking is disabled
    }
  }, [])

  const handleCTAClick = (ctaName: string) => {
    trackEvent("cta_click", ctaName)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 2.5,
        ease: [0.2, 1, 0.4, 1],
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        delayChildren: 2.5,
      },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const textReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 3.5,
        ease: [0.1, 1, 0.2, 1],
      },
    },
  }

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
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
        <div className="fixed top-0 left-0 w-full h-screen z-0">
          <motion.video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale brightness-110"
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
            animate={{ opacity: 0.8 }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3watermarked_preview-Bk5N138nsMFSjnIXU2MYPxuk7C2dB7.mp4" type="video/mp4" />
          </motion.video>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <motion.header
            className="px-6 py-8 md:px-12 md:py-10 flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.0, delay: 3.0, ease: "easeOut" }}
          >
            <div className="hidden md:block">
              <span className="font-alfabet text-[10px] tracking-widest uppercase text-black/60">Est. 2004</span>
            </div>

            <motion.button
              className="logo-hover transition-all mx-auto md:mx-0 opacity-90 hover:opacity-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image src="/images/ag-logo.svg" alt="AG Logo" width={140} height={46} className="h-10 md:h-12 w-auto" />
            </motion.button>

            <div className="hidden md:block">
              <span className="font-alfabet text-[10px] tracking-widest uppercase text-black/60">Vancouver, BC</span>
            </div>
          </motion.header>

          {/* Hero Content */}
          <motion.div
            className="flex min-h-[80vh] items-center justify-center px-6"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <motion.div
              className="text-center flex flex-col items-center max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp} className="mb-12 relative">
                <span className="font-alfabet font-medium text-[10px] md:text-[11px] tracking-[0.3em] uppercase border-b border-black/10 pb-2 bg-gradient-to-r from-[#8B4513] via-[#333333] to-black bg-clip-text text-transparent relative z-10">
                  Physician · Entrepreneur · Founder
                </span>
              </motion.div>

              <motion.h1
                variants={textReveal}
                className="font-ivyjournal text-black text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tight mb-10 font-normal mix-blend-multiply"
              >
                Dr. Ali Ghahary
                <span className="block text-2xl md:text-3xl lg:text-4xl font-light mt-6 font-alfabet tracking-normal text-slate-500/80">
                  MD, CCFP
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="font-alfabet text-black/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
              >
                Reimagining the future of healthcare through ethical AI, interoperability, and patient empowerment.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-24 flex flex-col items-center gap-4 opacity-40">
                <span className="font-alfabet text-[9px] tracking-[0.2em] uppercase">Scroll to Explore</span>
                <div className="h-12 w-[1px] bg-gradient-to-b from-black to-transparent"></div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Refined Grid Layout */}
      <section className="relative z-20 bg-white py-32 md:py-48" ref={aboutRef.ref}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24"
            variants={staggerContainer}
            initial="hidden"
            animate={aboutRef.isInView ? "visible" : "hidden"}
          >
            <div className="md:col-span-3 relative">
              <motion.div variants={fadeInUp} className="sticky top-32 border-t border-black/10 pt-6">
                <span className="font-alfabet text-[10px] tracking-widest uppercase text-slate-400 block mb-4">
                  01 / Biography
                </span>
                <h2 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9]">
                  The
                  <br />
                  Vision
                </h2>
              </motion.div>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <motion.div variants={fadeInUp} className="mb-24">
                <h3 className="font-ivyjournal text-4xl md:text-6xl leading-[1.1] mb-16 text-black font-light -ml-1 md:-ml-2">
                  <span className="bg-gradient-to-r from-[#A0522D] via-[#696969] to-black bg-clip-text text-transparent italic pr-2">
                    Reimagining
                  </span>
                  healthcare requires more than just technology—it demands a fundamental shift in how we view the
                  patient-provider relationship.
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                  <div className="space-y-8">
                    <p className="font-alfabet font-light text-black/90 text-lg leading-[1.8] first-letter:text-5xl first-letter:font-ivyjournal first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                      Dr. Ali Ghahary is a physician, entrepreneur, and thought leader reimagining healthcare on a
                      global scale. As a board-certified general practitioner (CCFP) with over 20 years of front-line
                      clinical experience, he combines deep medical expertise with a passion for innovation.
                    </p>
                    <p className="font-alfabet font-light text-black/80 text-lg leading-[1.8]">
                      He earned his Doctor of Medicine (MD) with honors from the University of Alberta and completed his
                      Certification in the College of Family Physicians (CCFP) at McGill University.
                    </p>
                  </div>
                  <div className="space-y-8 pt-0 md:pt-12">
                    <p className="font-alfabet font-light text-black/80 text-lg leading-[1.8]">
                      In 2024, he presented his seminal work on AI ethics, "The KNGHT Doctrine," at the World Economic
                      Forum in Davos. This framework for ethical AI in medicine remains the focus of his research.
                    </p>
                    <p className="font-alfabet font-light text-black/80 text-lg leading-[1.8]">
                      Dr. Ghahary is also an actor, filmmaker, and executive producer. He is currently the founder and
                      CEO of Damavand Pictures, where he explores the intersection of storytelling and healthcare
                      innovation.
                    </p>
                    <div className="pt-8 border-t border-black/5">
                      <p className="font-alfabet font-light text-[10px] tracking-widest uppercase text-slate-400">
                        Last updated: January 2025
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="border-t border-black/10 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div>
                    <h4 className="font-alfabet text-[10px] tracking-widest uppercase mb-6 text-black/40">
                      Core Values
                    </h4>
                  </div>
                  <div className="md:col-span-2">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 font-alfabet font-light text-black text-sm tracking-wide">
                      {[
                        "Technological Parity",
                        "Innovation Productivity",
                        "Patient-Centricity",
                        "Clinician-Centricity",
                        "Data Sovereignty",
                        "Public Trust",
                        "The Hippocratic Oath",
                        "Ethics in AI",
                        "Compliance Excellence",
                        "Global Collaboration",
                      ].map((value, i) => (
                        <li key={i} className="flex items-center gap-4 group cursor-default">
                          <span className="w-1 h-1 bg-black rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                          <span className="group-hover:translate-x-2 transition-transform duration-500 ease-out">
                            {value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section - Editorial List Style */}
      <section className="relative z-30 bg-[#0a0a0a] text-white py-32 md:py-48" id="projects" ref={projectsRef.ref}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={projectsRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="md:col-span-3">
              <div className="sticky top-32 border-t border-white/10 pt-6">
                <span className="font-alfabet text-[10px] tracking-widest uppercase text-white/40 block mb-4">
                  02 / Ventures
                </span>
                <h2 className="font-ivyjournal text-4xl md:text-5xl text-white leading-[0.9]">
                  Selected
                  <br />
                  Works
                </h2>
              </div>
            </div>

            <div className="md:col-span-9">
              <div className="space-y-0 divide-y divide-white/10 border-t border-white/10">
                {/* Armada Housecall */}
                <motion.div
                  variants={fadeInUp}
                  className="group py-16 md:py-24 hover:bg-white/[0.02] transition-colors duration-700 -mx-6 px-6 md:-mx-12 md:px-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                    <div className="md:col-span-1">
                      <span className="font-alfabet text-[10px] text-white/30">01</span>
                    </div>
                    <div className="md:col-span-6">
                      <h3 className="font-ivyjournal text-5xl md:text-7xl text-white group-hover:text-white/90 transition-colors mb-4">
                        Armada Housecall<sup className="text-lg md:text-2xl opacity-50">™</sup>
                      </h3>
                      <span className="font-alfabet text-[10px] tracking-widest uppercase text-white/40">
                        Virtual Care Platform
                      </span>
                    </div>
                    <div className="md:col-span-5 flex flex-col justify-between h-full">
                      <p className="font-alfabet font-light text-white/60 text-lg leading-relaxed mb-8 group-hover:text-white/80 transition-colors duration-500">
                        A comprehensive telehealth platform enabling physicians to deliver high-quality virtual care
                        with integrated scheduling, documentation, and patient management.
                      </p>
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-y-4 group-hover:translate-y-0">
                        <HousecallDemo />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Armada AssistMD */}
                <motion.div
                  variants={fadeInUp}
                  className="group py-16 md:py-24 hover:bg-white/[0.02] transition-colors duration-700 -mx-6 px-6 md:-mx-12 md:px-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                    <div className="md:col-span-1">
                      <span className="font-alfabet text-[10px] text-white/30">02</span>
                    </div>
                    <div className="md:col-span-6">
                      <h3 className="font-ivyjournal text-5xl md:text-7xl text-white group-hover:text-white/90 transition-colors mb-4">
                        Armada AssistMD<sup className="text-lg md:text-2xl opacity-50">™</sup>
                      </h3>
                      <span className="font-alfabet text-[10px] tracking-widest uppercase text-white/40">
                        AI Clinical Assistant
                      </span>
                    </div>
                    <div className="md:col-span-5 flex flex-col justify-between h-full">
                      <p className="font-alfabet font-light text-white/60 text-lg leading-relaxed mb-8 group-hover:text-white/80 transition-colors duration-500">
                        An AI-powered clinical documentation tool that helps physicians save time while maintaining
                        accuracy and compliance in patient records.
                      </p>
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-y-4 group-hover:translate-y-0">
                        <AssistMDDemo />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Armada ArkPass */}
                <motion.div
                  variants={fadeInUp}
                  className="group py-16 md:py-24 hover:bg-white/[0.02] transition-colors duration-700 -mx-6 px-6 md:-mx-12 md:px-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                    <div className="md:col-span-1">
                      <span className="font-alfabet text-[10px] text-white/30">03</span>
                    </div>
                    <div className="md:col-span-6">
                      <h3 className="font-ivyjournal text-5xl md:text-7xl text-white group-hover:text-white/90 transition-colors mb-4">
                        Armada ArkPass<sup className="text-lg md:text-2xl opacity-50">™</sup>
                      </h3>
                      <span className="font-alfabet text-[10px] tracking-widest uppercase text-white/40">
                        Patient Data Platform
                      </span>
                    </div>
                    <div className="md:col-span-5 flex flex-col justify-between h-full">
                      <p className="font-alfabet font-light text-white/60 text-lg leading-relaxed mb-8 group-hover:text-white/80 transition-colors duration-500">
                        A secure, patient-controlled health data platform enabling seamless sharing of medical records
                        across providers and systems.
                      </p>
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-y-4 group-hover:translate-y-0">
                        <ArkPassDemo />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security & Principles Section - Minimalist */}
      <section className="bg-white py-32 md:py-48" ref={trustRef.ref}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24"
            variants={staggerContainer}
            initial="hidden"
            animate={trustRef.isInView ? "visible" : "hidden"}
          >
            <div className="md:col-span-3">
              <div className="sticky top-32 border-t border-black/10 pt-6">
                <span className="font-alfabet text-[10px] tracking-widest uppercase text-slate-400 block mb-4">
                  03 / Principles
                </span>
                <h2 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9]">
                  Trust &<br />
                  Security
                </h2>
              </div>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <motion.div variants={fadeInUp} className="mb-24">
                <p className="font-ivyjournal text-3xl md:text-5xl leading-[1.2] text-black font-light mb-16">
                  Every Armada MD product is designed with patient safety, data security, and ethical principles at its
                  foundation.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                  {[
                    { icon: Shield, title: "HIPAA Standards", desc: "Full Compliance" },
                    { icon: Lock, title: "Security Controls", desc: "Enterprise Grade" },
                    { icon: CheckCircle, title: "Data Encryption", desc: "Bank-Level" },
                    { icon: Award, title: "Best Practices", desc: "International" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="border-l border-black/10 pl-6 py-2 group hover:border-black/40 transition-colors duration-500"
                    >
                      <item.icon className="w-6 h-6 text-black mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                      <h3 className="font-alfabet text-xs tracking-widest uppercase mb-2 text-black">{item.title}</h3>
                      <p className="font-alfabet font-light text-black/40 text-[10px] uppercase tracking-wider">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-neutral-50 p-16 md:p-24 rounded-[2rem]">
                <div className="flex flex-wrap gap-16 md:gap-32 justify-center items-center">
                  <div className="text-center">
                    <p className="font-ivyjournal text-6xl md:text-8xl text-black mb-4">
                      <AnimatedCounter end={20} suffix="+" shouldStart={trustRef.isInView} />
                    </p>
                    <p className="font-alfabet font-light text-black/40 text-[10px] uppercase tracking-[0.2em]">
                      Years Experience
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-ivyjournal text-6xl md:text-8xl text-black mb-4">
                      <AnimatedCounter end={100} suffix="%" shouldStart={trustRef.isInView} />
                    </p>
                    <p className="font-alfabet font-light text-black/40 text-[10px] uppercase tracking-[0.2em]">
                      Data Sovereignty
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ethical AI Section - Featured */}
      <section className="bg-black text-white py-32 md:py-48 relative overflow-hidden" ref={ethicalRef.ref}>
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            className="flex flex-col items-center text-center max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={ethicalRef.isInView ? "visible" : "hidden"}
          >
            <motion.span
              variants={fadeInUp}
              className="font-alfabet text-[10px] tracking-[0.3em] uppercase text-white/40 mb-12 border border-white/10 px-4 py-2 rounded-full"
            >
              04 / Ethics
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="font-ivyjournal text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9]"
            >
              Building Trust Through{" "}
              <span className="bg-gradient-to-r from-[#A0522D] via-[#696969] to-white bg-clip-text text-transparent italic">
                Transparency
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="font-alfabet font-light text-white/60 text-xl md:text-2xl leading-relaxed mb-16 max-w-3xl"
            >
              "AI in healthcare must be built on a foundation of ethical principles, transparency, and patient-centered
              design."
            </motion.p>

            <motion.a
              href="https://knghtdoctrine.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeInUp}
              className="group inline-flex items-center gap-4 font-alfabet text-sm border border-white/20 px-10 py-5 rounded-full hover:bg-white hover:text-black transition-all duration-500"
            >
              <span className="tracking-widest uppercase text-xs">Read The KNGHT Doctrine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - Minimal */}
      <section className="bg-white py-32 md:py-48" ref={contactRef.ref}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24"
            variants={staggerContainer}
            initial="hidden"
            animate={contactRef.isInView ? "visible" : "hidden"}
          >
            <div className="md:col-span-3">
              <div className="sticky top-32 border-t border-black/10 pt-6">
                <span className="font-alfabet text-[10px] tracking-widest uppercase text-slate-400 block mb-4">
                  05 / Contact
                </span>
                <h2 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9]">
                  Get in
                  <br />
                  Touch
                </h2>
              </div>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
                <motion.div variants={fadeInUp} className="group">
                  <h3 className="font-alfabet text-[10px] tracking-widest uppercase mb-8 text-black/40 group-hover:text-black transition-colors duration-500">
                    General Inquiries
                  </h3>
                  <a
                    href="mailto:info@armadamd.com"
                    className="font-ivyjournal text-3xl md:text-4xl text-black hover:text-slate-600 transition-colors block mb-4"
                  >
                    info@armadamd.com
                  </a>
                  <p className="font-alfabet font-light text-black/40 text-sm">
                    Questions about Dr. Ghahary or Armada MD
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp} className="group">
                  <h3 className="font-alfabet text-[10px] tracking-widest uppercase mb-8 text-black/40 group-hover:text-black transition-colors duration-500">
                    Press & Media
                  </h3>
                  <a
                    href="mailto:press@armadamd.com"
                    className="font-ivyjournal text-3xl md:text-4xl text-black hover:text-slate-600 transition-colors block mb-4"
                  >
                    press@armadamd.com
                  </a>
                  <p className="font-alfabet font-light text-black/40 text-sm">Interviews and media kits</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="group">
                  <h3 className="font-alfabet text-[10px] tracking-widest uppercase mb-8 text-black/40 group-hover:text-black transition-colors duration-500">
                    Product Demos
                  </h3>
                  <a
                    href="mailto:demo@armadamd.com"
                    className="font-ivyjournal text-3xl md:text-4xl text-black hover:text-slate-600 transition-colors block mb-4"
                  >
                    demo@armadamd.com
                  </a>
                  <p className="font-alfabet font-light text-black/40 text-sm">Schedule a platform walkthrough</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex items-end">
                  <a
                    href="https://www.linkedin.com/in/alighahary"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 font-alfabet text-xs tracking-widest uppercase bg-black text-white px-10 py-5 rounded-full hover:bg-slate-800 transition-all duration-500 group"
                  >
                    <span>Connect on LinkedIn</span>
                    <ExternalLink className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-white py-16 border-t border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-alfabet font-light text-black/30 text-[10px] uppercase tracking-widest">
            © {new Date().getFullYear()} Dr. Ali Ghahary. All rights reserved.
          </p>
          <div className="flex gap-12">
            <a
              href="/privacy"
              className="font-alfabet font-light text-black/30 text-[10px] uppercase tracking-widest hover:text-black transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="font-alfabet font-light text-black/30 text-[10px] uppercase tracking-widest hover:text-black transition-colors"
            >
              Terms
            </a>
            <a
              href="/legal"
              className="font-alfabet font-light text-black/30 text-[10px] uppercase tracking-widest hover:text-black transition-colors"
            >
              Legal
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
