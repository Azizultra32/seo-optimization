import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Harvest Studio",
  description: "Learn how Harvest Studio protects your privacy and handles your data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p>
              Harvest Studio ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">Analytics Data</h3>
            <p>We collect anonymous analytics data to understand how visitors use our website. This includes:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Page views and navigation patterns</li>
              <li>Time spent on pages</li>
              <li>Click events on buttons and links</li>
              <li>Scroll depth and engagement metrics</li>
              <li>Device type and browser information</li>
              <li>Performance metrics (page load times)</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              We do NOT store IP addresses. We use ephemeral session IDs that expire when you close your browser.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Demo Requests</h3>
            <p>When you request a demo, we collect:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Name and email address</li>
              <li>Organization name</li>
              <li>Phone number (optional)</li>
              <li>Message or specific interests</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Cookies</h3>
            <p>We use essential cookies for:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Session management (expires when browser closes)</li>
              <li>Analytics preferences</li>
              <li>Theme preferences (light/dark mode)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>To improve website functionality and user experience</li>
              <li>To respond to demo requests and inquiries</li>
              <li>To send product updates (only if you opt in)</li>
              <li>To analyze website performance and engagement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
            <p>Under Canadian privacy laws (PIPA/PIPEDA), you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Medical Privacy</h2>
            <p className="font-semibold text-amber-600 dark:text-amber-500">
              We do NOT collect Protected Health Information (PHI) through this website.
            </p>
            <p>
              This is a marketing website. Do not submit any personal health information, medical records, or patient
              data through contact forms or chat features. For patient care inquiries, please contact your healthcare
              provider directly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Encrypted data transmission (SSL/TLS)</li>
              <li>Secure database storage with Supabase</li>
              <li>Regular security audits</li>
              <li>Limited access to personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p>We use the following third-party services that may collect data:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Vercel (hosting and analytics)</li>
              <li>Supabase (database)</li>
              <li>OpenAI (content generation, no personal data shared)</li>
              <li>Google Search Console (website performance)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>For privacy-related questions or to exercise your rights, contact us at:</p>
            <p className="mt-4">
              Email:{" "}
              <a href="mailto:privacy@harveststudio.ca" className="text-primary hover:underline">
                privacy@harveststudio.ca
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
