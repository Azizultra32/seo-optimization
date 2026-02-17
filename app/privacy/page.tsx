import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Dr. Ali Ghahary",
  description: "Learn how Dr. Ali Ghahary protects your privacy and handles your data.",
  alternates: {
    canonical: "https://drghahary.com/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="font-alfabet text-[10px] tracking-[0.3em] uppercase text-black/60 hover:text-black transition-colors mb-12 inline-block"
        >
          &larr; Back to Home
        </Link>

        <h1 className="font-ivyjournal text-4xl md:text-5xl text-black leading-[0.9] mb-8">Privacy Policy</h1>

        <div className="max-w-none">
          <p className="font-alfabet font-light text-black/60 text-sm mb-12">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Overview</h2>
            <p className="font-alfabet font-light text-black/80 text-lg leading-[1.8]">
              Dr. Ali Ghahary and this website (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
              our website.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Information We Collect</h2>

            <h3 className="font-alfabet text-sm font-medium mb-3 mt-8 text-black">Analytics Data</h3>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              We collect anonymous analytics data to understand how visitors use our website. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4 font-alfabet font-light text-black/70 text-base">
              <li>Page views and navigation patterns</li>
              <li>Time spent on pages</li>
              <li>Click events on buttons and links</li>
              <li>Scroll depth and engagement metrics</li>
              <li>Device type and browser information</li>
              <li>Performance metrics (page load times)</li>
            </ul>
            <p className="font-alfabet font-light text-black/60 text-sm mt-4">
              We do NOT store IP addresses. We use ephemeral session IDs that expire when you close your browser.
            </p>

            <h3 className="font-alfabet text-sm font-medium mb-3 mt-8 text-black">Cookies</h3>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">We use essential cookies for:</p>
            <ul className="list-disc pl-6 space-y-2 my-4 font-alfabet font-light text-black/70 text-base">
              <li>Session management (expires when browser closes)</li>
              <li>Analytics preferences</li>
              <li>Theme preferences</li>
            </ul>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Medical Privacy</h2>
            <p className="font-alfabet font-medium text-amber-700 text-base mb-4">
              We do NOT collect Protected Health Information (PHI) through this website.
            </p>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              This is a marketing website. Do not submit any personal health information, medical records, or patient
              data through contact forms or chat features. For patient care inquiries, please contact your healthcare
              provider directly.
            </p>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Your Privacy Rights</h2>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8] mb-4">
              Under Canadian privacy laws (PIPA/PIPEDA), you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4 font-alfabet font-light text-black/70 text-base">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-12 border-t border-black/10 pt-8">
            <h2 className="font-alfabet text-xs tracking-widest uppercase mb-6 text-black">Contact Us</h2>
            <p className="font-alfabet font-light text-black/80 text-base leading-[1.8]">
              For privacy-related questions or to exercise your rights, contact us at:{" "}
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
