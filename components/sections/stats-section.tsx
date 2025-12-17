"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { useCounter } from "@/hooks/use-counter"
import { useSafeInView } from "@/hooks/use-in-view"
import { trackEvent } from "@/lib/analytics"

interface StatItemProps {
  value: number
  suffix: string
  label: string
  duration?: number
  shouldAnimate: boolean
}

function StatItem({ value, suffix, label, duration = 2000, shouldAnimate }: StatItemProps) {
  const count = useCounter(value, duration, 0, shouldAnimate)

  return (
    <div className="text-center">
      <div className="font-ivyjournal text-5xl md:text-6xl lg:text-7xl text-white mb-2">
        {shouldAnimate ? count : value}
        <span className="text-white/70">{suffix}</span>
      </div>
      <p className="font-alfabet text-sm md:text-base text-white/60 uppercase tracking-widest">
        {label}
      </p>
    </div>
  )
}

const stats = [
  { value: 20, suffix: "+", label: "Years Experience" },
  { value: 100, suffix: "K+", label: "Patients Served" },
  { value: 500, suffix: "K+", label: "Consultations" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
]

interface StatsSectionProps {
  prefersReducedMotion: boolean
}

export function StatsSection({ prefersReducedMotion }: StatsSectionProps) {
  const { ref, isInView } = useSafeInView({ threshold: 0.3, triggerOnce: true })

  // Track when stats become visible
  if (isInView) {
    trackEvent("section_view", "Stats Section")
  }

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-gradient-to-b from-[#1a1612] to-[#0d0b09]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="font-ivyjournal text-3xl md:text-4xl text-white mb-4">
            Two Decades of Impact
          </h2>
          <p className="font-alfabet text-base text-white/50 max-w-2xl mx-auto">
            Building trust through consistent excellence in patient care and healthcare innovation.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: prefersReducedMotion ? 0 : index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <StatItem
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                shouldAnimate={isInView && !prefersReducedMotion}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
