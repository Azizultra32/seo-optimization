"use client"

import React from "react"

import { useEffect, useState, useRef, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Lock, Shield, CheckCircle, Award, ExternalLink } from "@/components/icons"
// import { CommandBar } from "@/components/command-bar"; // Temporarily disabled
import { HousecallDemo, AssistMDDemo, ArkPassDemo } from "@/components/product-demo-dialog"
import { trackPageView } from "@/lib/analytics"
import { motion } from "@/components/ui/motion"
import { useSafeInView } from "@/hooks/use-in-view"
import { useCounter } from "@/hooks/use-counter"
import { trackPerformance } from "@/lib/performance"

// Cinematic animated letter component
interface AnimatedLettersProps {
  text: string
  className?: string
  baseDelay?: number
  letterDelay?: number
  animationType?: "reveal" | "wave" | "split"
}

function AnimatedLetters({
  text,
  className = "",
  baseDelay = 0,
  letterDelay = 0.05,
  animationType = "reveal"
}: AnimatedLettersProps) {
  const letters = text.split("")

  return (
    <span className={`inline-block ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{
            opacity: 0,
            y: animationType === "wave" ? 20 : 40,
            rotateX: animationType === "reveal" ? -90 : 0,
            filter: "blur(10px)"
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)"
          }}
          transition={{
            duration: 0.8,
            delay: baseDelay + index * letterDelay,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{
            display: letter === " " ? "inline" : "inline-block",
            minWidth: letter === " " ? "0.3em" : "auto"
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  )
}

// Cinematic animated words component
interface AnimatedWordsProps {
  text: string
  className?: string
  baseDelay?: number
  wordDelay?: number
}

function AnimatedWords({
  text,
  className = "",
  baseDelay = 0,
  wordDelay = 0.15
}: AnimatedWordsProps) {
  const words = text.split(" ")

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.3em]"
          initial={{
            opacity: 0,
            y: 30,
            filter: "blur(12px)"
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)"
          }}
          transition={{
            duration: 0.9,
            delay: baseDelay + index * wordDelay,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

export function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  const visionRef = useSafeInView({ threshold: 0.2 })
  const aboutRef = useSafeInView({ threshold: 0.2 })
  const statsRef = useSafeInView({ threshold: 0.3 })
  const projectsRef = useSafeInView({ threshold: 0.1 })
  const trustRef = useSafeInView({ threshold: 0.2 })
  const ethicalRef = useSafeInView({ threshold: 0.3 })
  const contactRef = useSafeInView({ threshold: 0.3 })

  // Animated counters for stats section
  const yearsCount = useCounter(20, 2000, 0, statsRef.isInView)
  const patientsCount = useCounter(100000, 2500, 0, statsRef.isInView)
  const consultationsCount = useCounter(500000, 2500, 0, statsRef.isInView)
  const satisfactionCount = useCounter(98, 2000, 0, statsRef.isInView)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Honor reduced-motion preferences and align the hero video playback accordingly
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleMotionPreference = () => {
      setPrefersReducedMotion(motionQuery.matches)

      if (videoRef.current) {
        if (motionQuery.matches) {
          videoRef.current.pause()
        } else {
          videoRef.current.play().catch(() => videoRef.current?.load())
        }
      }
    }

    handleMotionPreference()
    motionQuery.addEventListener("change", handleMotionPreference)

    if (!motionQuery.matches && videoRef.current) {
      videoRef.current.load()
    }

    // Track page view
    trackPageView(window.location.pathname)

    // Track Core Web Vitals
    let observer: PerformanceObserver | undefined
    if ("PerformanceObserver" in window) {
      try {
        observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "largest-contentful-paint") {
              trackPerformance("LCP", entry.startTime)
            }
          }
        })
        observer.observe({ entryTypes: ["largest-contentful-paint"] })
      } catch (e) {
        console.error("Performance tracking error:", e)
      }
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotionPreference)
      observer?.disconnect()
    }
  }, [])

  // Animation variants - unused with mock but kept for structure
  const heroStagger = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 2.5 + i * 0.3,
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  const scrollStagger = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.15,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  const heroAnimationsEnabled = !prefersReducedMotion

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Hero Section with DNA Video Background */}
      <section className="relative min-h-screen w-full overflow-hidden bg-white">
        <div className="fixed top-0 left-0 w-full h-screen z-0">
          <motion.video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover brightness-110"
            style={{ objectPosition: "center center" }}
            autoPlay={!prefersReducedMotion}
            muted
            loop={!prefersReducedMotion}
            playsInline
            preload={prefersReducedMotion ? "metadata" : "auto"}
            controls={false}
            poster="/images/dna-helix-background.jpeg"
            disablePictureInPicture
            disableRemotePlayback
            initial={heroAnimationsEnabled ? { opacity: 0 } : false}
            animate={heroAnimationsEnabled ? { opacity: 0.25 } : { opacity: 1 }}
            transition={heroAnimationsEnabled ? { duration: 3.5, ease: "easeInOut" } : { duration: 0 }}
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3watermarked_preview-Bk5N138nsMFSjnIXU2MYPxuk7C2dB7.mp4" type="video/mp4" />
          </motion.video>

          <div className="absolute inset-0 bg-hero-overlay backdrop-blur-[1px] pointer-events-none" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="px-6 py-8 md:px-12 md:py-10 flex justify-between items-center">
            <div className="hidden md:block">
              <span className="font-alfabet text-[10px] tracking-[0.3em] uppercase text-black/60">Est. 2004</span>
            </div>

            <motion.button
              className="logo-hover transition-all mx-auto md:mx-0 opacity-90 hover:opacity-100"
              whileHover={heroAnimationsEnabled ? { scale: 1.02 } : undefined}
              whileTap={heroAnimationsEnabled ? { scale: 0.98 } : undefined}
            >
              <Image src="/images/ag-logo.svg" alt="AG Logo" width={140} height={46} className="h-10 md:h-12 w-auto" />
            </motion.button>

            <div className="hidden md:block">
              <span className="font-alfabet text-[10px] tracking-[0.3em] uppercase text-black/60">Vancouver, BC</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="flex min-h-[80vh] items-center justify-center px-6">
            <div className="text-center flex flex-col items-center max-w-6xl mx-auto">
              {/* Animated title badges with staggered reveal */}
              <div className="mb-10 relative flex justify-center gap-4 md:gap-6">
                {heroAnimationsEnabled ? (
                  <>
                    {["Physician", "Entrepreneur", "Founder"].map((title, index) => (
                      <motion.span
                        key={title}
                        className="font-alfabet font-medium text-[10px] md:text-[11px] tracking-[0.3em] uppercase bg-brand-gradient bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)", scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                        transition={{
                          duration: 1,
                          delay: 0.3 + index * 0.7,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                      >
                        {title}
                      </motion.span>
                    ))}
                  </>
                ) : (
                  <>
                    <span className="font-alfabet font-medium text-[10px] md:text-[11px] tracking-[0.3em] uppercase bg-brand-gradient bg-clip-text text-transparent">Physician</span>
                    <span className="font-alfabet font-medium text-[10px] md:text-[11px] tracking-[0.3em] uppercase bg-brand-gradient bg-clip-text text-transparent">Entrepreneur</span>
                    <span className="font-alfabet font-medium text-[10px] md:text-[11px] tracking-[0.3em] uppercase bg-brand-gradient bg-clip-text text-transparent">Founder</span>
                  </>
                )}
              </div>

              {/* Main name with letter-by-letter animation */}
              <h1 className="font-ivyjournal text-black/95 text-4xl md:text-5xl lg:text-7xl leading-[0.9] tracking-tight mb-6 font-normal">
                {heroAnimationsEnabled ? (
                  <>
                    <span className="block">
                      <AnimatedLetters
                        text="Dr. Ali Ghahary"
                        baseDelay={2.4}
                        letterDelay={0.06}
                        className="inline-block"
                      />
                    </span>
                    <motion.span
                      className="block text-lg md:text-xl lg:text-2xl font-light mt-4 font-alfabet tracking-[0.15em] text-slate-600"
                      initial={{ opacity: 0, y: 20, letterSpacing: "-0.2em", filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, letterSpacing: "0.15em", filter: "blur(0px)" }}
                      transition={{ duration: 1.2, delay: 3.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      MD, CCFP
                    </motion.span>
                  </>
                ) : (
                  <>
                    <span className="block">Dr. Ali Ghahary</span>
                    <span className="block text-lg md:text-xl lg:text-2xl font-light mt-4 font-alfabet tracking-[0.15em] text-slate-600">
                      MD, CCFP
                    </span>
                  </>
                )}
              </h1>

              {/* Tagline with word-by-word animation */}
              <div className="font-alfabet font-normal text-black leading-relaxed max-w-4xl text-base md:text-lg">
                {heroAnimationsEnabled ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 4.2 }}
                  >
                    <motion.span
                      className="bg-brand-gradient-soft bg-clip-text text-transparent font-medium text-shine"
                      initial={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      transition={{ duration: 1.2, delay: 4.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      Reimagining
                    </motion.span>{" "}
                    <AnimatedWords
                      text="the future of healthcare through ethical AI, interoperability, and patient empowerment."
                      baseDelay={4.8}
                      wordDelay={0.08}
                    />
                  </motion.div>
                ) : (
                  <p>
                    <span className="bg-brand-gradient-soft bg-clip-text text-transparent font-medium">Reimagining</span>{" "}
                    the future of healthcare through ethical AI, interoperability, and patient empowerment.
                  </p>
                )}
              </div>

              {/* Scroll indicator with enhanced animation */}
              <motion.div
                className="mt-24 flex flex-col items-center gap-4"
                initial={heroAnimationsEnabled ? { opacity: 0, y: 30 } : false}
                animate={{ opacity: 0.6, y: 0 }}
                transition={heroAnimationsEnabled ? { duration: 1, delay: 6 } : { duration: 0 }}
              >
                <motion.span
                  className="font-alfabet text-[9px] tracking-[0.3em] uppercase"
                  animate={heroAnimationsEnabled ? { opacity: [0.4, 0.8, 0.4] } : undefined}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Scroll to Explore
                </motion.span>
                <motion.div
                  className="h-20 w-[1px] bg-gradient-to-b from-black/60 via-black/30 to-transparent relative overflow-hidden"
                  animate={heroAnimationsEnabled ? { scaleY: [1, 1.1, 1] } : undefined}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-black via-black/50 to-transparent"
                    animate={heroAnimationsEnabled ? { y: [0, 56, 0] } : undefined}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Biography Section - Editorial Layout */}
      <section
        id="vision"
        className="relative z-20 bg-gradient-to-b from-zinc-50 via-white to-white py-32 md:py-48 text-transparent bg-transparent overflow-hidden"
        ref={visionRef.ref}
      >
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 bg-transparent text-transparent">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            <div className="md:col-span-3 relative">
              <div className={`sticky top-32 border-t border-black/10 pt-6 ${visionRef.isInView ? "fade-up" : ""}`}>
                <span className="font-alfabet text-[10px] tracking-widest uppercase text-slate-400 block mb-4">
                  01 / Vision
                </span>
                <h2 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9]">
                  The
                  <br />
                  Vision
                </h2>
              </div>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <div className="mb-24">
                <h3 className="font-ivyjournal text-4xl md:text-6xl leading-[1.1] mb-16 text-black font-light -ml-1 md:-ml-2">
                  {visionRef.isInView ? (
                    <>
                      <motion.span
                        className="bg-gradient-to-r from-[#A0522D] via-[#696969] to-black bg-clip-text text-transparent italic pr-2 inline-block text-shine"
                        initial={{ opacity: 0, x: -50, filter: "blur(15px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        Transforming
                      </motion.span>
                      {" "}
                      <AnimatedWords
                        text="healthcare isn't a software problem—it's a philosophical one."
                        baseDelay={0.4}
                        wordDelay={0.06}
                      />
                      <br className="hidden md:block" />
                      <AnimatedWords
                        text="It starts with how we think about patients, clinicians, and data."
                        baseDelay={1.2}
                        wordDelay={0.06}
                      />
                    </>
                  ) : (
                    <>
                      <span className="bg-gradient-to-r from-[#A0522D] via-[#696969] to-black bg-clip-text text-transparent italic pr-2">
                        Transforming
                      </span>
                      healthcare isn't a software problem—it's a philosophical one. It starts with how we think about
                      patients, clinicians, and data.
                    </>
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Refined Grid Layout */}
      <section
        className="relative z-20 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 py-32 md:py-48"
        ref={aboutRef.ref}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            <div className="md:col-span-3 relative">
              <div className={`sticky top-32 border-t border-black/10 pt-6 ${aboutRef.isInView ? "fade-up" : ""}`}>
                <span className="font-alfabet text-[10px] tracking-widest uppercase text-slate-400 block mb-4">
                  02 / Biography
                </span>
                <h2 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9]">
                  The
                  <br />
                  Founder
                </h2>
              </div>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                <div className="space-y-8">
                  <p
                    className={`font-alfabet font-light text-black/90 text-lg leading-[1.8] first-letter:text-5xl first-letter:font-ivyjournal first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] ${aboutRef.isInView ? "fade-up fade-delay-2" : ""}`}
                  >
                    Dr. Ali Ghahary is a Canadian physician, entrepreneur, and multidisciplinary creator.
                    Board-certified (CCFP) with over 20 years of clinical experience, he combines frontline medical
                    expertise with a commitment to ethical innovation.
                  </p>
                  <p
                    className={`font-alfabet font-light text-black/80 text-lg leading-[1.8] ${aboutRef.isInView ? "fade-up fade-delay-3" : ""}`}
                  >
                    MD with Honours from the University of Alberta. CCFP Certification from McGill University.
                  </p>
                </div>
                <div className="space-y-8 pt-0 md:pt-12">
                  <p
                    className={`font-alfabet font-light text-black/80 text-lg leading-[1.8] ${aboutRef.isInView ? "fade-up fade-delay-4" : ""}`}
                  >
                    His clinical career revealed a truth: healthcare is held back not by talent, but by fragmented
                    systems and technologies built without clinicians in the room. In response, he founded ArmadaMD.
                  </p>
                  <p
                    className={`font-alfabet font-light text-black/80 text-lg leading-[1.8] ${aboutRef.isInView ? "fade-up fade-delay-4" : ""}`}
                  >
                    Outside medicine, he leads Damavand Pictures as an actor, filmmaker, and executive
                    producer—exploring stories of identity, culture, and resilience. Every venture shares one objective:
                    build systems that serve people, not the other way around.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Ticker - AI Supply inspired */}
      <section className="relative z-20 bg-[#0a1015] py-6 overflow-hidden border-y border-white/5">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-16">
                {[
                  { label: "World Economic Forum", sublabel: "Davos 2024" },
                  { label: "HIPAA Compliant", sublabel: "Healthcare Standard" },
                  { label: "20+ Years", sublabel: "Clinical Experience" },
                  { label: "AI Ethics Pioneer", sublabel: "KNGHT Doctrine" },
                  { label: "Canadian Healthcare", sublabel: "BC Licensed" },
                  { label: "100K+ Patients", sublabel: "Served" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0099ff]" />
                    <span className="font-alfabet text-xs tracking-widest uppercase text-white/70">
                      {item.label}
                    </span>
                    <span className="font-alfabet text-[10px] text-white/30">
                      {item.sublabel}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics Section - By the Numbers */}
      <section
        className="relative z-20 bg-gradient-elegant py-24 md:py-32 overflow-hidden"
        ref={statsRef.ref}
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative">
          <div className="text-center mb-16">
            <span className="font-alfabet text-[10px] tracking-widest uppercase text-white/40 block mb-4">
              Impact & Reach
            </span>
            <h2 className={`font-ivyjournal text-4xl md:text-5xl text-white leading-[0.9] ${statsRef.isInView ? "fade-up" : ""}`}>
              By the Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Years of Experience */}
            <div className={`text-center group ${statsRef.isInView ? "fade-up fade-delay-1" : ""}`}>
              <div className="relative inline-block mb-4">
                <span className="font-ivyjournal text-6xl md:text-7xl lg:text-8xl text-white font-light">
                  {yearsCount}
                  <span className="text-3xl md:text-4xl text-accent-gold align-top">+</span>
                </span>
              </div>
              <p className="font-alfabet text-[10px] md:text-xs tracking-widest uppercase text-white/60">
                Years of Clinical
                <br />
                Experience
              </p>
            </div>

            {/* Patients Served */}
            <div className={`text-center group ${statsRef.isInView ? "fade-up fade-delay-2" : ""}`}>
              <div className="relative inline-block mb-4">
                <span className="font-ivyjournal text-6xl md:text-7xl lg:text-8xl text-white font-light">
                  {patientsCount >= 1000 ? `${Math.floor(patientsCount / 1000)}K` : patientsCount}
                  <span className="text-3xl md:text-4xl text-accent-gold align-top">+</span>
                </span>
              </div>
              <p className="font-alfabet text-[10px] md:text-xs tracking-widest uppercase text-white/60">
                Patients
                <br />
                Served
              </p>
            </div>

            {/* Consultations */}
            <div className={`text-center group ${statsRef.isInView ? "fade-up fade-delay-3" : ""}`}>
              <div className="relative inline-block mb-4">
                <span className="font-ivyjournal text-6xl md:text-7xl lg:text-8xl text-white font-light">
                  {consultationsCount >= 1000 ? `${Math.floor(consultationsCount / 1000)}K` : consultationsCount}
                  <span className="text-3xl md:text-4xl text-accent-gold align-top">+</span>
                </span>
              </div>
              <p className="font-alfabet text-[10px] md:text-xs tracking-widest uppercase text-white/60">
                Consultations
                <br />
                Completed
              </p>
            </div>

            {/* Patient Satisfaction */}
            <div className={`text-center group ${statsRef.isInView ? "fade-up fade-delay-4" : ""}`}>
              <div className="relative inline-block mb-4">
                <span className="font-ivyjournal text-6xl md:text-7xl lg:text-8xl text-white font-light">
                  {satisfactionCount}
                  <span className="text-3xl md:text-4xl text-accent-gold align-top">%</span>
                </span>
              </div>
              <p className="font-alfabet text-[10px] md:text-xs tracking-widest uppercase text-white/60">
                Patient
                <br />
                Satisfaction
              </p>
            </div>
          </div>

          {/* Decorative line */}
          <div className="mt-16 flex justify-center">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Projects Section - Editorial List Style */}
      <section className="relative z-30 bg-[#0a0a0a] text-white py-32 md:py-48" id="projects" ref={projectsRef.ref}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-24">
            <div className="md:col-span-3">
              <div className={`sticky top-32 border-t border-white/10 pt-6 ${projectsRef.isInView ? "fade-up" : ""}`}>
                <span className="font-alfabet text-[10px] text-white/30 block mb-4">03 / Ventures</span>
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
                <div
                  className="group py-16 md:py-24 hover:bg-white/[0.02] transition-colors duration-700 -mx-6 px-6 md:-mx-12 md:px-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                    <div className="md:col-span-1">
                      <motion.span
                        className="font-alfabet text-[10px] text-white/30"
                        initial={projectsRef.isInView ? { opacity: 0, scale: 2 } : false}
                        animate={projectsRef.isInView ? { opacity: 1, scale: 1 } : false}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        01
                      </motion.span>
                    </div>
                    <div className="md:col-span-6">
                      <h3 className="font-ivyjournal text-5xl md:text-7xl text-white group-hover:text-white/90 transition-colors mb-4">
                        {projectsRef.isInView ? (
                          <AnimatedLetters
                            text="Armada Housecall"
                            baseDelay={0.3}
                            letterDelay={0.04}
                          />
                        ) : (
                          "Armada Housecall"
                        )}
                        <sup className="md:text-2xl opacity-50 relative -translate-y-3 text-3xl my-0">™</sup>
                      </h3>
                      <motion.span
                        className="font-alfabet text-[10px] tracking-widest uppercase text-white/40 block"
                        initial={projectsRef.isInView ? { opacity: 0, y: 10 } : false}
                        animate={projectsRef.isInView ? { opacity: 1, y: 0 } : false}
                        transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                      >
                        Home-Based Care Platform
                      </motion.span>
                    </div>
                    <div className="md:col-span-5 flex flex-col justify-between h-full">
                      <motion.p
                        className="font-alfabet font-light text-white/60 text-lg leading-relaxed mb-8 group-hover:text-white/80 transition-colors duration-500"
                        initial={projectsRef.isInView ? { opacity: 0, y: 20, filter: "blur(5px)" } : false}
                        animate={projectsRef.isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : false}
                        transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        Exam-enabled care in the home through nurse-led visits, intelligent documentation, and rapid
                        physician oversight. Built for global scale and clinical reliability.
                      </motion.p>
                      <motion.div
                        className="flex justify-end"
                        initial={projectsRef.isInView ? { opacity: 0, scale: 0.8 } : false}
                        animate={projectsRef.isInView ? { opacity: 1, scale: 1 } : false}
                        transition={{ duration: 0.6, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <HousecallDemo />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Armada AssistMD */}
                <div
                  className="group py-16 md:py-24 hover:bg-white/[0.02] transition-colors duration-700 -mx-6 px-6 md:-mx-12 md:px-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                    <div className="md:col-span-1">
                      <motion.span
                        className="font-alfabet text-[10px] text-white/30"
                        initial={projectsRef.isInView ? { opacity: 0, scale: 2 } : false}
                        animate={projectsRef.isInView ? { opacity: 1, scale: 1 } : false}
                        transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
                      >
                        02
                      </motion.span>
                    </div>
                    <div className="md:col-span-6">
                      <h3 className="font-ivyjournal text-5xl md:text-7xl text-white group-hover:text-white/90 transition-colors mb-4">
                        {projectsRef.isInView ? (
                          <AnimatedLetters
                            text="Armada AssistMD"
                            baseDelay={2}
                            letterDelay={0.04}
                          />
                        ) : (
                          "Armada AssistMD"
                        )}
                        <sup className="text-lg md:text-2xl opacity-50 relative top-1">™</sup>
                      </h3>
                      <motion.span
                        className="font-alfabet text-[10px] tracking-widest uppercase text-white/40 block"
                        initial={projectsRef.isInView ? { opacity: 0, y: 10 } : false}
                        animate={projectsRef.isInView ? { opacity: 1, y: 0 } : false}
                        transition={{ duration: 0.6, delay: 2.7, ease: [0.16, 1, 0.3, 1] }}
                      >
                        AI Clinical Documentation
                      </motion.span>
                    </div>
                    <div className="md:col-span-5 flex flex-col justify-between h-full">
                      <motion.p
                        className="font-alfabet font-light text-white/60 text-lg leading-relaxed mb-8 group-hover:text-white/80 transition-colors duration-500"
                        initial={projectsRef.isInView ? { opacity: 0, y: 20, filter: "blur(5px)" } : false}
                        animate={projectsRef.isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : false}
                        transition={{ duration: 0.8, delay: 2.9, ease: [0.16, 1, 0.3, 1] }}
                      >
                        Real-time clinical intelligence that structures conversations into accurate, defensible medical
                        notes—reducing cognitive load while enhancing clarity.
                      </motion.p>
                      <motion.div
                        className="flex justify-end"
                        initial={projectsRef.isInView ? { opacity: 0, scale: 0.8 } : false}
                        animate={projectsRef.isInView ? { opacity: 1, scale: 1 } : false}
                        transition={{ duration: 0.6, delay: 3.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <AssistMDDemo />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Armada ArkPass */}
                <div
                  className="group py-16 md:py-24 hover:bg-white/[0.02] transition-colors duration-700 -mx-6 px-6 md:-mx-12 md:px-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                    <div className="md:col-span-1">
                      <motion.span
                        className="font-alfabet text-[10px] text-white/30"
                        initial={projectsRef.isInView ? { opacity: 0, scale: 2 } : false}
                        animate={projectsRef.isInView ? { opacity: 1, scale: 1 } : false}
                        transition={{ duration: 0.8, delay: 3.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        03
                      </motion.span>
                    </div>
                    <div className="md:col-span-6">
                      <h3 className="font-ivyjournal text-5xl md:text-7xl text-white group-hover:text-white/90 transition-colors mb-4">
                        {projectsRef.isInView ? (
                          <AnimatedLetters
                            text="Armada ArkPass"
                            baseDelay={3.7}
                            letterDelay={0.04}
                          />
                        ) : (
                          "Armada ArkPass"
                        )}
                        <sup className="text-lg md:text-2xl opacity-50 relative top-1">™</sup>
                      </h3>
                      <motion.span
                        className="font-alfabet text-[10px] tracking-widest uppercase text-white/40 block"
                        initial={projectsRef.isInView ? { opacity: 0, y: 10 } : false}
                        animate={projectsRef.isInView ? { opacity: 1, y: 0 } : false}
                        transition={{ duration: 0.6, delay: 4.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        Patient-Owned Health Data
                      </motion.span>
                    </div>
                    <div className="md:col-span-5 flex flex-col justify-between h-full">
                      <motion.p
                        className="font-alfabet font-light text-white/60 text-lg leading-relaxed mb-8 group-hover:text-white/80 transition-colors duration-500"
                        initial={projectsRef.isInView ? { opacity: 0, y: 20, filter: "blur(5px)" } : false}
                        animate={projectsRef.isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : false}
                        transition={{ duration: 0.8, delay: 4.6, ease: [0.16, 1, 0.3, 1] }}
                      >
                        A secure, patient-controlled identity and medical-record layer built for seamless
                        interoperability across clinics, provinces, and countries.
                      </motion.p>
                      <motion.div
                        className="flex justify-end"
                        initial={projectsRef.isInView ? { opacity: 0, scale: 0.8 } : false}
                        animate={projectsRef.isInView ? { opacity: 1, scale: 1 } : false}
                        transition={{ duration: 0.6, delay: 4.9, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ArkPassDemo />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Principles Section - Minimalist */}
      <section className="relative z-20 bg-white py-32 md:py-48 overflow-hidden" ref={trustRef.ref}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            <div className="md:col-span-3">
              <div className={`sticky top-32 border-t border-black/10 pt-6 ${trustRef.isInView ? "fade-up" : ""}`}>
                <span className="font-alfabet text-[10px] tracking-widest uppercase text-slate-400 block mb-4">
                  04 / Principles
                </span>
                <h2 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9]">
                  Trust &<br />
                  Security
                </h2>
              </div>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <div className="mb-24">
                <p
                  className={`font-ivyjournal text-3xl md:text-5xl leading-[1.2] text-black font-light mb-16 ${trustRef.isInView ? "fade-up fade-delay-1" : ""}`}
                >
                  If it can't be trusted, it shouldn't exist. Every system follows this rule.
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
                      className={`border-l-2 border-black/10 pl-6 py-2 group hover:border-[var(--accent-brand)] transition-all duration-500 ${trustRef.isInView ? `fade-up fade-delay-${i + 2}` : ""}`}
                    >
                      {React.createElement(item.icon, {
                        className:
                          "w-7 h-7 text-black mb-6 opacity-50 group-hover:opacity-100 group-hover:text-[var(--accent-brand)] group-hover:scale-110 transition-all duration-300",
                      })}
                      <h3 className="font-alfabet text-xs tracking-widest uppercase mb-2 text-black group-hover:text-[var(--accent-brand-dark)] transition-colors">{item.title}</h3>
                      <p className="font-alfabet font-light text-black/40 text-[10px] uppercase tracking-wider">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics Section - The KNGHT Doctrine */}
      <section className="relative z-20 bg-neutral-50 py-32 md:py-48" ref={ethicalRef.ref}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            <div className="md:col-span-3">
              <div className={`sticky top-32 border-t border-black/10 pt-6 ${ethicalRef.isInView ? "fade-up" : ""}`}>
                <span className="font-alfabet text-[10px] tracking-widest uppercase text-slate-400 block mb-4">
                  05 / Ethics
                </span>
                <h2 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9]">
                  The KNGHT
                  <br />
                  Doctrine
                </h2>
              </div>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <div className="mb-24">
                <p
                  className={`font-ivyjournal text-3xl md:text-5xl leading-[1.2] text-black font-light mb-16 ${ethicalRef.isInView ? "fade-up fade-delay-1" : ""}`}
                >
                  An ethical framework for AI in medicine, presented at the World Economic Forum (Davos) 2024.
                </p>

                <p
                  className={`font-alfabet font-light text-black/80 text-lg leading-[1.8] mb-12 max-w-3xl ${ethicalRef.isInView ? "fade-up fade-delay-2" : ""}`}
                >
                  The KNGHT Doctrine prioritizes patient sovereignty and clinical integrity above algorithmic
                  efficiency. Ethics isn't a branding exercise—it's infrastructure.
                </p>
              </div>

              <div className="bg-white p-16 md:p-24 rounded-[2rem] shadow-sm border border-black/5 hover:shadow-lg transition-shadow duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div>
                    <h4 className="font-alfabet text-[10px] tracking-widest uppercase mb-8 text-black/40">
                      Core Values
                    </h4>
                    <div className="hidden md:block h-px w-16 bg-gradient-to-r from-[var(--accent-brand)] to-transparent opacity-60" />
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
                          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[var(--accent-brand)] to-[var(--accent-brand-dark)] opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
                          <span className="group-hover:translate-x-2 group-hover:text-[var(--accent-brand-dark)] transition-all duration-300 ease-out">
                            {value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Minimal */}
      <section id="contact" className="relative z-20 bg-white pt-32 pb-12 md:pt-48 md:pb-16" ref={contactRef.ref}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-24">
            <div className="md:col-span-3">
              <div className={`sticky top-32 border-t border-black/10 pt-6 ${contactRef.isInView ? "fade-up" : ""}`}>
                <span className="font-alfabet text-[10px] tracking-widest uppercase text-slate-400 block mb-4">
                  06 / Contact
                </span>
                <h2 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9]">
                  Get in
                  <br />
                  Touch
                </h2>
              </div>
            </div>

            <div className="md:col-span-9 flex flex-col justify-center">
              <div className={`group ${contactRef.isInView ? "fade-up fade-delay-1" : ""}`}>
                <h3 className="font-alfabet text-[10px] tracking-widest uppercase mb-6 text-black/40 group-hover:text-black transition-colors duration-500">
                  General Inquiries
                </h3>
                <a
                  href="mailto:info@armadamd.com"
                  className="font-ivyjournal text-3xl md:text-4xl text-black hover:text-slate-600 transition-colors block mb-3"
                >
                  info@armadamd.com
                </a>
                <p className="font-alfabet font-light text-black/40 text-sm">
                  Questions, press inquiries, or partnership opportunities
                </p>
              </div>

              <motion.div
                className="mt-12 flex flex-col items-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={contactRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <a
                  href="https://www.linkedin.com/in/alighahary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-brand-gradient-soft px-8 py-3 text-white font-alfabet text-xs tracking-[0.2em] uppercase shadow-lg shadow-black/10 transition-all duration-500 hover:shadow-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60"
                >
                  <span>Connect on LinkedIn</span>
                  <span
                    className="h-2 w-2 rounded-full bg-white/80 shadow-[0_0_0_3px] shadow-white/20"
                    aria-hidden="true"
                  />
                </a>
                <span className="font-alfabet text-xs tracking-[0.18em] uppercase text-black/60">
                  Let's start a conversation
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-[#0a0a0a] text-white pt-20 pb-8">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-white/10">
            {/* Brand Column */}
            <div className="md:col-span-4">
              <Image src="/images/ag-logo.svg" alt="AG Logo" width={100} height={33} className="h-8 w-auto mb-6 invert opacity-90" />
              <p className="font-alfabet font-light text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
                Transforming healthcare through ethical innovation, patient empowerment, and physician-led technology solutions.
              </p>
              <div className="flex items-center gap-2 text-white/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-alfabet text-xs">Vancouver, BC, Canada</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2 md:col-start-6">
              <h4 className="font-alfabet text-[10px] tracking-widest uppercase text-white/40 mb-6">Ventures</h4>
              <ul className="space-y-3">
                {["Armada Housecall", "Armada AssistMD", "Armada ArkPass", "Damavand Pictures"].map((item) => (
                  <li key={item}>
                    <button className="font-alfabet font-light text-white/70 text-sm hover:text-white transition-colors text-left">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="md:col-span-2">
              <h4 className="font-alfabet text-[10px] tracking-widest uppercase text-white/40 mb-6">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="font-alfabet font-light text-white/70 text-sm hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="font-alfabet font-light text-white/70 text-sm hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="font-alfabet font-light text-white/70 text-sm hover:text-white transition-colors">
                    Legal Notice
                  </Link>
                </li>
                <li>
                  <button className="font-alfabet font-light text-white/70 text-sm hover:text-white transition-colors">
                    KNGHT Doctrine
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="md:col-span-3">
              <h4 className="font-alfabet text-[10px] tracking-widest uppercase text-white/40 mb-6">Stay Connected</h4>
              <p className="font-alfabet font-light text-white/60 text-sm mb-4">
                Follow the journey of ethical healthcare innovation.
              </p>
              <div className="flex items-center gap-4 mb-6">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/alighahary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                {/* Twitter/X */}
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* Email */}
                <a
                  href="mailto:info@armadamd.com"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group"
                  aria-label="Email"
                >
                  <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
              <a
                href="mailto:info@armadamd.com"
                className="font-alfabet text-sm text-white/80 hover:text-white transition-colors"
              >
                info@armadamd.com
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-alfabet font-light text-white/40 text-[10px] uppercase tracking-widest">
              © {new Date().getFullYear()} Dr. Ali Ghahary. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="font-alfabet text-[10px] text-white/30 uppercase tracking-wider">
                Built with purpose in Vancouver
              </span>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <span className="font-alfabet text-[10px] text-white/30 uppercase tracking-wider">
                Est. 2004
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
