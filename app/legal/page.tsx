import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Legal | Dr. Ali Ghahary",
  description: "Legal information and disclaimers for alighahary.com.",
  alternates: {
    canonical: "https://alighahary.com/legal",
  },
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Legal Information</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Medical Disclaimer</h2>
            <p className="font-semibold text-amber-600 dark:text-amber-500">This website does not provide medical advice.</p>
            <p>
              The information provided on this website is for informational purposes only and should not be used as a
              substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your
              physician or another qualified healthcare provider with any questions regarding a medical condition.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Professional Statement</h2>
            <p>
              The opinions expressed on this website are those of Dr. Ali Ghahary and are provided for educational and
              informational purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Copyright Notice</h2>
            <p>© {new Date().getFullYear()} Dr. Ali Ghahary. All rights reserved.</p>
            <p>
              All content on this website, including text, graphics, logos, and images, is protected by copyright and
              other applicable intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>
              For legal inquiries, contact{" "}
              <a href="mailto:legal@alighahary.com" className="text-primary hover:underline">
                legal@alighahary.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
