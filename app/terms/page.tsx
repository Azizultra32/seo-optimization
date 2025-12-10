import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Harvest Studio",
  description: "Terms and conditions for using Harvest Studio services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>
                By accessing and using Harvest Studio’s website and services, you accept and agree to be bound by the
              terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p>
                Permission is granted to temporarily access the materials on Harvest Studio’s website for personal,
              non-commercial transitory viewing only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Medical Disclaimer</h2>
            <p className="font-semibold text-amber-600 dark:text-amber-500">
              This website does not provide medical advice.
            </p>
            <p>
              The information on this website is for informational purposes only and is not intended as a substitute for
              professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other
              qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p>
                The materials on Harvest Studio’s website are provided on an “as is” basis. Harvest Studio makes no
              warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            <p>
              In no event shall Harvest Studio or its suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or
                inability to use the materials on Harvest Studio’s website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of British Columbia,
              Canada.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>
              Questions about the Terms of Service should be sent to us at{" "}
              <a href="mailto:legal@harveststudio.ca" className="text-primary hover:underline">
                legal@harveststudio.ca
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
