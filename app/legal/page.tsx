import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Legal | Dr. Ali Ghahary",
  description: "Legal information and disclaimers for drghahary.com.",
  alternates: {
    canonical: "https://drghahary.com/legal",
  },
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="font-alfabet text-[10px] tracking-[0.3em] uppercase text-black/60 hover:text-black transition-colors mb-12 inline-block"
        >
          &larr; Back to Home
        </Link>

        <h1 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9] mb-8">Legal Information</h1>

        <div className="max-w-none">
          <p className="font-alfabet font-light text-black/60 text-sm mb-12">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Medical Disclaimer</h2>
            <p className="font-alfabet font-medium text-amber-700 text-base mb-4">
              This website does not provide medical advice.
            </p>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              The information provided on this website is for informational purposes only and should not be used as a
              substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your
              physician or another qualified healthcare provider with any questions regarding a medical condition.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Professional Statement</h2>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              The opinions expressed on this website are those of Dr. Ali Ghahary and are provided for educational and
              informational purposes.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Copyright Notice</h2>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              &copy; {new Date().getFullYear()} Dr. Ali Ghahary. All rights reserved.
            </p>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8] mt-4">
              All content on this website, including text, graphics, logos, and images, is protected by copyright and
              other applicable intellectual property laws.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Contact</h2>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              For legal inquiries, contact{" "}
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
