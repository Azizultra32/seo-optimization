"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

// Letter-by-letter animation component
function AnimatedLetters({
  text,
  baseDelay = 0,
  letterDelay = 0.03,
  className = "",
}: {
  text: string
  baseDelay?: number
  letterDelay?: number
  className?: string
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
          transition={{
            delay: baseDelay + i * letterDelay,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  )
}

interface HeroSectionProps {
  prefersReducedMotion: boolean
}

export function HeroSection({ prefersReducedMotion }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  // Track hero view
  useEffect(() => {
    trackEvent("section_view", "Hero Section")
  }, [])

  // Handle video loading
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", () => setVideoLoaded(true))
    }
  }, [])

  const scrollToContent = () => {
    const visionSection = document.getElementById("vision")
    if (visionSection) {
      visionSection.scrollIntoView({ behavior: "smooth" })
      trackEvent("cta_click", "Hero Scroll Down")
    }
  }

  return (
    <motion.section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ opacity: heroOpacity }}
    >
      {/* Video Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: heroScale }}
      >
        {!prefersReducedMotion ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero-poster.jpg"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/videos/dna-helix.webm" type="video/webm" />
            <source src="/videos/dna-helix.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a3632] to-[#1a1612]" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Pre-title */}
          <motion.p
            variants={itemVariants}
            className="mb-4 font-alfabet text-sm uppercase tracking-[0.3em] text-white/70"
          >
            Physician • Entrepreneur • Innovator
          </motion.p>

          {/* Main Title */}
          <h1 className="font-ivyjournal text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            {prefersReducedMotion ? (
              "Dr. Ali Ghahary"
            ) : (
              <>
                <AnimatedLetters text="Dr. Ali " baseDelay={0.5} />
                <AnimatedLetters text="Ghahary" baseDelay={0.8} className="text-white/90" />
              </>
            )}
          </h1>

          {/* Credentials */}
          <motion.p
            variants={itemVariants}
            className="font-alfabet text-lg md:text-xl text-white/80 tracking-wide"
          >
            MD, CCFP
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-2xl mx-auto font-alfabet text-base md:text-lg text-white/60 leading-relaxed"
          >
            Reimagining healthcare through ethical AI, patient-centered technology, 
            and two decades of clinical excellence.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          onClick={scrollToContent}
          className="absolute bottom-12 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          aria-label="Scroll to content"
        >
          <span className="font-alfabet text-xs uppercase tracking-widest">Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </div>
    </motion.section>
  )
}
