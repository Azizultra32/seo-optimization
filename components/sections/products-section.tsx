"use client"

import { motion } from "framer-motion"
import { useSafeInView } from "@/hooks/use-in-view"
import { HousecallDemo, AssistMDDemo, ArkPassDemo } from "@/components/product-demo-dialog"
import { trackEvent } from "@/lib/analytics"

interface ProductCardProps {
  name: string
  tagline: string
  description: string
  gradient: string
  demo: React.ReactNode
  index: number
  isInView: boolean
  prefersReducedMotion: boolean
}

function ProductCard({
  name,
  tagline,
  description,
  gradient,
  demo,
  index,
  isInView,
  prefersReducedMotion,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: prefersReducedMotion ? 0 : index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      <div
        className={`relative h-full rounded-2xl p-8 md:p-10 ${gradient} overflow-hidden`}
      >
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="relative z-10">
          {/* Product Name */}
          <h3 className="font-ivyjournal text-2xl md:text-3xl text-white mb-2">
            {name}
            <sup className="text-xs ml-1 opacity-70">™</sup>
          </h3>

          {/* Tagline */}
          <p className="font-alfabet text-sm text-white/70 uppercase tracking-wider mb-6">
            {tagline}
          </p>

          {/* Description */}
          <p className="font-alfabet text-base text-white/80 leading-relaxed mb-8">
            {description}
          </p>

          {/* Demo Button */}
          {demo}
        </div>

        {/* Decorative element */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
      </div>
    </motion.div>
  )
}

const products = [
  {
    name: "Armada Housecall",
    tagline: "Virtual Care Platform",
    description:
      "A comprehensive telehealth solution enabling physicians to deliver high-quality care remotely. Secure video consultations, integrated documentation, and seamless patient management.",
    gradient: "bg-gradient-to-br from-[#3a3632] to-[#1a1612]",
    demo: <HousecallDemo />,
  },
  {
    name: "Armada AssistMD",
    tagline: "AI Clinical Documentation",
    description:
      "Transform clinical conversations into accurate documentation in real-time. Reduce administrative burden by 70% while maintaining comprehensive patient records.",
    gradient: "bg-gradient-to-br from-blue-900 to-blue-950",
    demo: <AssistMDDemo />,
  },
  {
    name: "Armada ArkPass",
    tagline: "Patient Data Sovereignty",
    description:
      "Empowering patients with true ownership of their health data. Secure, portable, and interoperable—moving healthcare records at the speed of life.",
    gradient: "bg-gradient-to-br from-green-900 to-green-950",
    demo: <ArkPassDemo />,
  },
]

interface ProductsSectionProps {
  prefersReducedMotion: boolean
}

export function ProductsSection({ prefersReducedMotion }: ProductsSectionProps) {
  const { ref, isInView } = useSafeInView({ threshold: 0.1, triggerOnce: true })

  if (isInView) {
    trackEvent("section_view", "Products Section")
  }

  return (
    <section
      ref={ref}
      id="projects"
      className="relative py-24 md:py-32 bg-neutral-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="font-alfabet text-sm uppercase tracking-[0.3em] text-black/50 mb-4">
            The Armada Ecosystem
          </p>
          <h2 className="font-ivyjournal text-4xl md:text-5xl text-black mb-6">
            Healthcare, Reimagined
          </h2>
          <p className="font-alfabet text-base text-black/60 max-w-2xl mx-auto leading-relaxed">
            Three interconnected platforms working in harmony to transform how healthcare 
            is delivered, documented, and owned.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              {...product}
              index={index}
              isInView={isInView}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
