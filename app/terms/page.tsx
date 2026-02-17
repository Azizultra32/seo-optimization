import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | Dr. Ali Ghahary",
  description: "Terms and conditions for using drghahary.com services.",
  alternates: {
    canonical: "https://drghahary.com/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="font-alfabet text-[10px] tracking-[0.3em] uppercase text-black/60 hover:text-black transition-colors mb-12 inline-block"
        >
          &larr; Back to Home
        </Link>

        <h1 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9] mb-8">Terms of Service</h1>

        <div className="max-w-none">
          <p className="font-alfabet font-light text-black/60 text-sm mb-12">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Acceptance of Terms</h2>
            <p className="font-alfabet font-light text-black/80 text-lg leading-[1.8]">
              By accessing and using this website and services, you accept and agree to be bound by the terms and
              provision of this agreement.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Medical Disclaimer</h2>
            <p className="font-alfabet font-medium text-amber-700 text-base mb-4">
              This website does not provide medical advice.
            </p>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              The information on this website is for informational purposes only and is not intended as a substitute for
              professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other
              qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Use License</h2>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              Permission is granted to temporarily access the materials on this website for personal,
              non-commercial transitory viewing only.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Disclaimer</h2>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              The materials on this website are provided on an &apos;as is&apos; basis. We make no warranties, expressed or
              implied, and hereby disclaim and negate all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
              intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Limitations</h2>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              In no event shall Dr. Ali Ghahary or suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or
              inability to use the materials on this website.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Governing Law</h2>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              These terms and conditions are governed by and construed in accordance with the laws of British Columbia,
              Canada.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Contact</h2>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              Questions about the Terms of Service should be sent to{" "}
              <a href="mailto:info@armadamd.com" className="text-black hover:underline">
                info@armadamd.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
