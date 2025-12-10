"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Play, CheckCircle, Shield, Zap, Users, Clock, FileText, Video, Lock } from "@/components/icons"
import { motion } from "@/components/ui/motion"
import { trackEvent } from "@/lib/analytics"

interface ProductDemoProps {
  productName: string
  tagline: string
  children: React.ReactNode
}

export function ProductDemoDialog({ productName, tagline, children }: ProductDemoProps) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
    trackEvent("demo_opened", productName)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpen}
          className="font-alfabet font-normal text-white text-xs md:text-sm border border-white px-5 py-2 rounded-full hover:bg-white hover:text-[#3a3632] transition-colors"
        >
          <Play className="w-3 h-3 mr-2" />
          View Interactive Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-ivyjournal text-3xl text-black">{productName}</DialogTitle>
          <p className="font-alfabet text-sm text-black/60">{tagline}</p>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export function HousecallDemo() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const features = [
    {
      icon: Video,
      title: "Secure Video Consultations",
      description: "HIPAA-compliant video calls with crystal-clear quality and no third-party software required.",
    },
    {
      icon: FileText,
      title: "Integrated Documentation",
      description: "Create clinical notes during or after consultations with AI-powered assistance.",
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Comprehensive patient profiles, appointment history, and secure messaging.",
    },
    {
      icon: Clock,
      title: "Smart Scheduling",
      description: "Automated appointment booking, reminders, and calendar synchronization.",
    },
  ]

  return (
    <ProductDemoDialog productName="Armada Housecall™" tagline="Comprehensive Virtual Care Platform">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">
              Transforming Virtual Healthcare Delivery
            </h3>
            <p className="font-alfabet text-base text-black/80 leading-relaxed mb-6">
              Armada Housecall is a comprehensive telehealth platform designed by physicians for physicians. It combines
              secure video consultations, clinical documentation, and patient management into one seamless experience.
            </p>
            <div className="aspect-video bg-gradient-to-br from-[#3a3632] to-[#2a2622] rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-alfabet text-sm">Demo Video Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">Streamlined Virtual Care Workflow</h3>
            <div className="space-y-4">
              {[
                { step: 1, title: "Patient Books Appointment", description: "Automated scheduling with calendar sync" },
                { step: 2, title: "Pre-Visit Preparation", description: "Review patient history and previous notes" },
                { step: 3, title: "Video Consultation", description: "HIPAA-compliant secure video call" },
                { step: 4, title: "Clinical Documentation", description: "AI-assisted note creation during visit" },
                { step: 5, title: "Follow-Up & Billing", description: "Automated reminders and billing integration" },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  className="flex gap-4 p-4 border border-black/10 rounded-lg hover:border-black/30 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-[#3a3632] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-alfabet font-semibold text-black">{item.title}</h4>
                    <p className="font-alfabet text-sm text-black/60">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">Comprehensive Feature Set</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-4 border border-black/10 rounded-lg hover:shadow-md transition-shadow"
                  whileHover={{ y: -3 }}
                >
                  {feature.icon && <feature.icon className="w-8 h-8 text-[#3a3632] mb-3" />}
                  <h4 className="font-alfabet font-semibold text-black mb-2">{feature.title}</h4>
                  <p className="font-alfabet text-sm text-black/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">
              Why Physicians Choose Armada Housecall
            </h3>
            <div className="space-y-3">
              {[
                "Save 2-3 hours daily on administrative tasks",
                "Increase patient capacity by 30-40%",
                "Improve patient satisfaction with convenient access",
                "Reduce no-show rates with automated reminders",
                "Expand practice reach to underserved communities",
                "Maintain quality of care with comprehensive tools",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="font-alfabet text-base text-black/80">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-[#3a3632]/5 rounded-lg border border-[#3a3632]/20">
              <p className="font-alfabet text-sm text-black/70">
                <strong className="text-black">Ready to transform your practice?</strong> Schedule a personalized demo
                with our team to see Armada Housecall in action.
              </p>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </ProductDemoDialog>
  )
}

export function AssistMDDemo() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const capabilities = [
    {
      icon: Zap,
      title: "Real-Time Transcription",
      description: "Convert conversations into structured clinical notes instantly with 95%+ accuracy.",
    },
    {
      icon: FileText,
      title: "Smart Templates",
      description: "AI learns your documentation style and suggests relevant templates automatically.",
    },
    {
      icon: Shield,
      title: "Compliance Built-In",
      description: "Automatic SOAP note formatting, ICD-10 coding suggestions, and audit trail.",
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "AI flags missing information and ensures complete, accurate documentation.",
    },
  ]

  return (
    <ProductDemoDialog productName="Armada AssistMD™" tagline="AI-Powered Clinical Documentation Assistant">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="roi">ROI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">Reclaim Your Time, Focus on Patients</h3>
            <p className="font-alfabet text-base text-black/80 leading-relaxed mb-6">
              AssistMD uses ethical AI to transform clinical conversations into accurate, comprehensive documentation.
              Spend less time typing, more time caring.
            </p>
            <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-alfabet text-sm">Interactive Demo Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="how-it-works" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">Simple, Seamless Documentation</h3>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Listen",
                  description: "AssistMD captures your patient conversation in real-time with ambient listening.",
                },
                {
                  step: 2,
                  title: "Process",
                  description: "AI extracts clinical insights, symptoms, diagnoses, and treatment plans.",
                },
                {
                  step: 3,
                  title: "Structure",
                  description: "Automatically formats notes into SOAP, BIRP, or your preferred template.",
                },
                {
                  step: 4,
                  title: "Review & Sign",
                  description: "Quick review interface with inline editing and one-click signature.",
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  className="flex gap-4 p-4 border border-black/10 rounded-lg hover:border-blue-600/30 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-alfabet font-semibold text-black">{item.title}</h4>
                    <p className="font-alfabet text-sm text-black/60">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">Powerful AI Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  className="p-4 border border-black/10 rounded-lg hover:shadow-md transition-shadow"
                  whileHover={{ y: -3 }}
                >
                  {capability.icon && <capability.icon className="w-8 h-8 text-blue-600 mb-3" />}
                  <h4 className="font-alfabet font-semibold text-black mb-2">{capability.title}</h4>
                  <p className="font-alfabet text-sm text-black/60">{capability.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">Measurable Impact on Your Practice</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <p className="text-4xl font-bold text-blue-600 mb-2">70%</p>
                <p className="font-alfabet text-sm text-black/70">Time Saved on Documentation</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <p className="text-4xl font-bold text-blue-600 mb-2">95%</p>
                <p className="font-alfabet text-sm text-black/70">Clinical Accuracy</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <p className="text-4xl font-bold text-blue-600 mb-2">3-5</p>
                <p className="font-alfabet text-sm text-black/70">Extra Patients Per Day</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-alfabet font-semibold text-black">What Physicians Say:</h4>
                <blockquote className="border-l-4 border-blue-600 pl-4 italic text-black/70 font-alfabet">
                  “AssistMD has given me back 2 hours every day. I can see more patients and still leave on time.”
                </blockquote>
              <p className="text-sm text-black/60 font-alfabet">— Dr. Sarah Chen, Family Medicine</p>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </ProductDemoDialog>
  )
}

export function ArkPassDemo() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const features = [
    {
      icon: Shield,
      title: "Patient-Controlled Access",
      description: "Patients decide who sees their data and can revoke access anytime.",
    },
    {
      icon: Lock,
      title: "Military-Grade Encryption",
      description: "End-to-end encryption ensures data is secure in transit and at rest.",
    },
    {
      icon: Zap,
      title: "Instant Data Sharing",
      description: "Share complete medical history with new providers in seconds, not weeks.",
    },
    {
      icon: CheckCircle,
      title: "Universal Compatibility",
      description: "Works with all major EHR systems and healthcare providers.",
    },
  ]

  return (
    <ProductDemoDialog productName="Armada ArkPass™" tagline="Patient-Controlled Health Data Platform">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="for-patients">For Patients</TabsTrigger>
          <TabsTrigger value="for-providers">For Providers</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">Your Health Data, Your Control</h3>
            <p className="font-alfabet text-base text-black/80 leading-relaxed mb-6">
              ArkPass revolutionizes how health data moves between providers. Built on principles of data sovereignty
              and patient empowerment, it gives patients true ownership of their medical records.
            </p>
            <div className="aspect-video bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-alfabet text-sm">Interactive Flow Demo Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="for-patients" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">Empowering Patients</h3>
            <div className="space-y-3 mb-6">
              {[
                "Access your complete medical history anytime, anywhere",
                "Share records instantly when seeing a new doctor",
                "Grant temporary access for emergencies",
                "Track who has viewed your data and when",
                "Revoke access from previous providers",
                "Download your data in standard formats",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="font-alfabet text-base text-black/80">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="font-alfabet text-sm text-black/70">
                <strong className="text-black">Example:</strong> Moving to a new city? Share your complete medical
                history with your new family doctor in under 60 seconds.
              </p>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="for-providers" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">Benefits for Healthcare Providers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-4 border border-black/10 rounded-lg hover:shadow-md transition-shadow"
                  whileHover={{ y: -3 }}
                >
                  {feature.icon && <feature.icon className="w-8 h-8 text-green-600 mb-3" />}
                  <h4 className="font-alfabet font-semibold text-black mb-2">{feature.title}</h4>
                  <p className="font-alfabet text-sm text-black/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h3 className="font-alfabet font-semibold text-lg text-black mb-4">Security Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-4 border border-black/10 rounded-lg hover:shadow-md transition-shadow"
                  whileHover={{ y: -3 }}
                >
                  {feature.icon && <feature.icon className="w-8 h-8 text-green-600 mb-3" />}
                  <h4 className="font-alfabet font-semibold text-black mb-2">{feature.title}</h4>
                  <p className="font-alfabet text-sm text-black/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </ProductDemoDialog>
  )
}
