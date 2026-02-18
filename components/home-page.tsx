"use client"
/* eslint-disable react-hooks/refs */

import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Lock, Shield, CheckCircle, Award, ExternalLink, ArrowRight } from "@/components/icons"
import { HousecallDemo, AssistMDDemo, ArkPassDemo } from "@/components/product-demo-dialog"
import { motion } from "framer-motion"
import { useSafeInView } from "@/hooks/use-in-view"

export function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoPaused, setIsVideoPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const visionRef = useSafeInView({ threshold: 0.2 })
  const aboutRef = useSafeInView({ threshold: 0.2 })
  const projectsRef = useSafeInView({ threshold: 0.1 })
  const trustRef = useSafeInView({ threshold: 0.2 })
  const ethicalRef = useSafeInView({ threshold: 0.3 })
  const contactRef = useSafeInView({ threshold: 0.3 })

  useEffect(() => {
    if (typeof window === "undefined") return

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

    return () => {
      motionQuery.removeEventListener("change", handleMotionPreference)
    }
  }, [])

  const heroAnimationsEnabled = !prefersReducedMotion

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPaused) {
        videoRef.current.play().catch(() => {})
        setIsVideoPaused(false)
      } else {
        videoRef.current.pause()
        setIsVideoPaused(true)
      }
    }
  }

  return (
    <div className="bg-background text-foreground min-h-screen font-body overflow-x-hidden">
      {/* Hero Section with Video */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
        {/* Fixed Video Background with Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
          <video
            ref={videoRef}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/dna-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            aria-label="DNA double helix animation representing healthcare innovation and genomics"
          >
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3watermarked_preview-Bk5N138nsMFSjnIXU2MYPxuk7C2dB7.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-hero-overlay backdrop-blur-[1px]" />
        </div>

        {/* Header Bar */}
        <div className="absolute top-0 left-0 right-0 w-full px-6 py-8 md:px-12 md:py-10 flex justify-between items-center z-10">
          <div className="hidden md:block">
            <span className="font-alfabet text-[10px] tracking-[0.3em] uppercase text-black/60">Est. 2004</span>
          </div>

          <motion.div
            className="logo-hover transition-all mx-auto md:mx-0 opacity-90 hover:opacity-100"
            whileHover={heroAnimationsEnabled ? { scale: 1.02 } : undefined}
            whileTap={heroAnimationsEnabled ? { scale: 0.98 } : undefined}
          >
            <Image src="/images/ag-logo.svg" alt="AG Logo" width={140} height={46} className="h-10 md:h-12 w-auto" priority />
          </motion.div>

          <div className="hidden md:block">
            <span className="font-alfabet text-[10px] tracking-[0.3em] uppercase text-black/60">Vancouver, BC</span>
          </div>
        </div>

        {/* Video Toggle Button */}
        <button
          onClick={toggleVideo}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60"
          aria-label={isVideoPaused ? "Play background video" : "Pause background video"}
        >
          {isVideoPaused ? (
            <svg className="w-4 h-4 text-black/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-black/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          )}
        </button>

        {/* Hero Content */}
        <div className="flex min-h-[80vh] items-center justify-center px-6">
          <div className="text-center flex flex-col items-center max-w-6xl mx-auto">
            <div className="mb-10 relative flex justify-center gap-3">
              <span className="trailer-title-1 font-alfabet font-medium text-[10px] md:text-[11px] tracking-[0.3em] uppercase bg-brand-gradient bg-clip-text text-transparent">
                Physician
              </span>
              <span className="trailer-title-2 font-alfabet font-medium text-[10px] md:text-[11px] tracking-[0.3em] uppercase bg-brand-gradient bg-clip-text text-transparent">
                Entrepreneur
              </span>
              <span className="trailer-title-3 font-alfabet font-medium text-[10px] md:text-[11px] tracking-[0.3em] uppercase bg-brand-gradient bg-clip-text text-transparent">
                Founder
              </span>
            </div>

            <motion.h1
              className="trailer-subtitle font-ivyjournal text-black/95 text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tight mb-6 font-normal"
              initial={heroAnimationsEnabled ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Dr. Ali Ghahary
              <span className="block text-lg md:text-xl lg:text-2xl font-light mt-3 font-alfabet tracking-normal text-slate-600">
                MD, CCFP
              </span>
            </motion.h1>

            <motion.p
              className="trailer-subtitle font-alfabet font-normal text-black leading-relaxed max-w-4xl"
              initial={heroAnimationsEnabled ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={heroAnimationsEnabled ? { duration: 0.8, delay: 2.8 } : { duration: 0 }}
            >
              <span className="bg-brand-gradient-soft bg-clip-text text-transparent font-normal">Rebuilding</span>{" "}
              healthcare from first principles — ethical AI, true interoperability, patient sovereignty.
            </motion.p>

            <motion.div
              className="trailer-subtitle mt-10 flex flex-col sm:flex-row items-center gap-4"
              initial={heroAnimationsEnabled ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={heroAnimationsEnabled ? { duration: 0.8, delay: 3.1 } : { duration: 0 }}
            >
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-brand-gradient-soft px-8 py-3 text-white font-alfabet text-xs tracking-[0.2em] uppercase shadow-lg shadow-black/10 transition-all duration-500 hover:shadow-black/20 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60"
              >
                <span>Schedule a Call</span>
                <span
                  className="h-2 w-2 rounded-full bg-white/80 shadow-[0_0_0_3px] shadow-white/20"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="https://www.linkedin.com/in/alighahary"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 px-6 py-3 text-black font-alfabet text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-black hover:text-white"
              >
                <span>Connect on LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </motion.div>

            <motion.div
              className="trailer-subtitle mt-24 flex flex-col items-center gap-4 opacity-40"
              initial={heroAnimationsEnabled ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 0.4, y: 0 }}
              transition={heroAnimationsEnabled ? { duration: 0.8, delay: 3.4 } : { duration: 0 }}
            >
              <span className="font-alfabet text-[9px] tracking-[0.2em] uppercase">Scroll to Explore</span>
              <div className="h-12 w-[1px] bg-gradient-to-b from-black to-transparent scroll-hint" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Biography Section */}
      <section
        id="vision"
        className="relative z-20 bg-gradient-to-b from-zinc-50 via-white to-white py-32 md:py-48"
        ref={visionRef.ref}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
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
                <h3
                  className={`font-ivyjournal text-4xl md:text-6xl leading-[1.1] mb-16 text-black font-light -ml-1 md:-ml-2 ${visionRef.isInView ? "fade-up fade-delay-1" : ""}`}
                >
                  <span className="bg-gradient-to-r from-[#A0522D] via-[#696969] to-black bg-clip-text text-transparent italic pr-2">
                    Transforming
                  </span>
                  {"healthcare isn't a software problem — it's a philosophical one."}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
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
                    Dr. Ali Ghahary is a Canadian physician, entrepreneur, and technologist. Board-certified (CCFP) with
                    over 20 years of clinical experience, he combines frontline medical expertise with a builder&apos;s
                    mindset for ethical technology.
                  </p>
                  <p
                    className={`font-alfabet font-light text-black/90 text-lg leading-[1.8] ${aboutRef.isInView ? "fade-up fade-delay-2" : ""}`}
                  >
                    <strong className="font-medium text-black">Clinical experience:</strong> Board-certified physician
                    (CCFP) with 20+ years of frontline medical practice.
                  </p>
                  <p
                    className={`font-alfabet font-light text-black/90 text-lg leading-[1.8] ${aboutRef.isInView ? "fade-up fade-delay-2" : ""}`}
                  >
                    <strong className="font-medium text-black">Education:</strong> MD with Honours, University of
                    Alberta. CCFP Certification, McGill University.
                  </p>
                </div>
                <div className="space-y-8 pt-0 md:pt-12">
                  <p
                    className={`font-alfabet font-light text-black/80 text-lg leading-[1.8] ${aboutRef.isInView ? "fade-up fade-delay-3" : ""}`}
                  >
                    <strong className="font-medium text-black">Technology focus:</strong> Healthcare systems are held
                    back by fragmentation and tools built without clinicians. ArmadaMD changes that.
                  </p>
                  <p
                    className={`font-alfabet font-light text-black/80 text-lg leading-[1.8] ${aboutRef.isInView ? "fade-up fade-delay-4" : ""}`}
                  >
                    <strong className="font-medium text-black">Creative work:</strong> Leads Damavand Pictures as actor,
                    filmmaker, and executive producer — stories of identity, culture, and resilience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="relative z-30 bg-[#0a0a0a] text-white py-32 md:py-48" id="projects" ref={projectsRef.ref}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-24">
            <div className="md:col-span-3">
              <div className={`sticky top-32 border-t border-white/10 pt-6 ${projectsRef.isInView ? "fade-up" : ""}`}>
                <span className="font-alfabet text-[10px] text-white/60 block mb-4">03 / Ventures</span>
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
                  className={`group py-16 md:py-24 hover:bg-white/[0.02] transition-colors duration-700 -mx-6 px-6 md:-mx-12 md:px-12 ${projectsRef.isInView ? "fade-up fade-delay-1" : ""}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                    <div className="md:col-span-1">
                      <span className="font-alfabet text-[10px] text-white/60">01</span>
                    </div>
                    <div className="md:col-span-6">
                      <h3 className="font-ivyjournal text-5xl md:text-7xl text-white group-hover:text-white/90 transition-colors mb-4">
                        Armada Housecall
                        <sup className="md:text-2xl opacity-50 relative -translate-y-3 text-3xl my-0">{"™"}</sup>
                      </h3>
                      <span className="font-alfabet text-[10px] tracking-widest uppercase text-white/40">
                        Home-Based Care Platform
                      </span>
                    </div>
                    <div className="md:col-span-5 flex flex-col justify-between h-full">
                      <p className="font-alfabet font-light text-white/60 text-lg leading-relaxed mb-4 group-hover:text-white/80 transition-colors duration-500">
                        Exam-enabled care in the home through nurse-led visits, intelligent documentation, and rapid
                        physician oversight. Designed for global scale. Built for clinical reliability.
                      </p>
                      <p className="font-alfabet text-[11px] tracking-wide uppercase text-white/40 mb-8">
                        {"<"}5 min physician response · HIPAA/PIPEDA compliant
                      </p>
                      <div className="flex justify-end opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
                        <HousecallDemo />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Armada AssistMD */}
                <div
                  className={`group py-16 md:py-24 hover:bg-white/[0.02] transition-colors duration-700 -mx-6 px-6 md:-mx-12 md:px-12 ${projectsRef.isInView ? "fade-up fade-delay-2" : ""}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                    <div className="md:col-span-1">
                      <span className="font-alfabet text-[10px] text-white/60">02</span>
                    </div>
                    <div className="md:col-span-6">
                      <h3 className="font-ivyjournal text-5xl md:text-7xl text-white group-hover:text-white/90 transition-colors mb-4">
                        Armada AssistMD<sup className="text-lg md:text-2xl opacity-50 relative top-1">{"™"}</sup>
                      </h3>
                      <span className="font-alfabet text-[10px] tracking-widest uppercase text-white/40">
                        AI Clinical Documentation
                      </span>
                    </div>
                    <div className="md:col-span-5 flex flex-col justify-between h-full">
                      <p className="font-alfabet font-light text-white/60 text-lg leading-relaxed mb-4 group-hover:text-white/80 transition-colors duration-500">
                        Real-time clinical intelligence that structures conversations into accurate, defensible medical
                        notes. Less friction. More clarity.
                      </p>
                      <p className="font-alfabet text-[11px] tracking-wide uppercase text-white/40 mb-8">
                        90% reduction in documentation time · SOC 2 Type II
                      </p>
                      <div className="flex justify-end opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
                        <AssistMDDemo />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Armada ArkPass */}
                <div
                  className={`group py-16 md:py-24 hover:bg-white/[0.02] transition-colors duration-700 -mx-6 px-6 md:-mx-12 md:px-12 ${projectsRef.isInView ? "fade-up fade-delay-3" : ""}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                    <div className="md:col-span-1">
                      <span className="font-alfabet text-[10px] text-white/60">03</span>
                    </div>
                    <div className="md:col-span-6">
                      <h3 className="font-ivyjournal text-5xl md:text-7xl text-white group-hover:text-white/90 transition-colors mb-4">
                        Armada ArkPass<sup className="text-lg md:text-2xl opacity-50 relative top-1">{"™"}</sup>
                      </h3>
                      <span className="font-alfabet text-[10px] tracking-widest uppercase text-white/40">
                        Patient-Owned Health Data
                      </span>
                    </div>
                    <div className="md:col-span-5 flex flex-col justify-between h-full">
                      <p className="font-alfabet font-light text-white/60 text-lg leading-relaxed mb-4 group-hover:text-white/80 transition-colors duration-500">
                        A secure, patient-controlled identity and medical-record layer. True interoperability — across
                        clinics, provinces, borders.
                      </p>
                      <p className="font-alfabet text-[11px] tracking-wide uppercase text-white/40 mb-8">
                        End-to-end encryption · Patient-controlled access
                      </p>
                      <div className="flex justify-end opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
                        <ArkPassDemo />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex justify-center">
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 px-8 py-3 text-white font-alfabet text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-white hover:text-black"
                >
                  <span>Discuss a Partnership</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Principles Section */}
      <section className="relative z-20 bg-white py-32 md:py-48" ref={trustRef.ref}>
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
                  {"If it can't be trusted, it shouldn't exist. Every system follows this rule."}
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
                      className={`border-l border-black/10 pl-6 py-2 group hover:border-black/40 transition-colors duration-500 ${trustRef.isInView ? `fade-up fade-delay-${i + 2}` : ""}`}
                    >
                      {React.createElement(item.icon, {
                        className:
                          "w-6 h-6 text-black mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500",
                      })}
                      <h3 className="font-alfabet text-xs tracking-widest uppercase mb-2 text-black">{item.title}</h3>
                      <p className="font-alfabet font-light text-black/60 text-[10px] uppercase tracking-wider">
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
                  {"The KNGHT Doctrine prioritizes patient sovereignty and clinical integrity above algorithmic efficiency. Ethics isn't a branding exercise — it's infrastructure."}
                </p>
              </div>

              <div className="bg-white p-16 md:p-24 rounded-[2rem] shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div>
                    <h4 className="font-alfabet text-[10px] tracking-widest uppercase mb-8 text-black/60">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
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
                <h3 className="font-alfabet text-[10px] tracking-widest uppercase mb-6 text-black/60 group-hover:text-black transition-colors duration-500">
                  General Inquiries
                </h3>
                <a
                  href="mailto:info@armadamd.com"
                  className="font-ivyjournal text-3xl md:text-4xl text-black hover:text-slate-600 transition-colors block mb-3"
                >
                  info@armadamd.com
                </a>
                <p className="font-alfabet font-light text-black/60 text-sm">Questions, press, or partnerships</p>
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
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-brand-gradient-soft px-8 py-3 text-white font-alfabet text-xs tracking-[0.2em] uppercase shadow-lg shadow-black/10 transition-all duration-500 hover:shadow-black/20 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60"
                >
                  <span>Connect on LinkedIn</span>
                  <span
                    className="h-2 w-2 rounded-full bg-white/80 shadow-[0_0_0_3px] shadow-white/20"
                    aria-hidden="true"
                  />
                </a>
                <span className="font-alfabet text-xs tracking-[0.18em] uppercase text-black/60">
                  {"Let's start a conversation"}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-alfabet font-light text-black/60 text-[10px] uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Dr. Ali Ghahary. All rights reserved.
            </p>
            <p className="font-alfabet font-light text-black/60 text-[9px] tracking-wide">
              Ethical AI · True Interoperability · Patient Sovereignty
            </p>
          </div>
          <div className="flex items-center gap-12">
            <a
              href="https://www.linkedin.com/in/alighahary"
              target="_blank"
              rel="noopener noreferrer"
              className="font-alfabet font-light text-black/60 text-[10px] uppercase tracking-widest hover:text-black transition-colors inline-flex items-center gap-2"
            >
              LinkedIn
              <ExternalLink className="w-3 h-3" />
            </a>
            <Link
              href="/privacy"
              className="font-alfabet font-light text-black/60 text-[10px] uppercase tracking-widest hover:text-black transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-alfabet font-light text-black/60 text-[10px] uppercase tracking-widest hover:text-black transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/legal"
              className="font-alfabet font-light text-black/60 text-[10px] uppercase tracking-widest hover:text-black transition-colors"
            >
              Legal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
