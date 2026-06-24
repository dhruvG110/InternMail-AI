"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, FileText, Brain, LineChart } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function MarketingPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl animate-pulse" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-purple-200/20 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-100/20 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200/50 backdrop-blur-md bg-white/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
            >
              <Briefcase className="h-5 w-5 text-white" />
            </motion.div>

            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InternTrack AI
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
            <motion.a
              href="#features"
              className="transition hover:text-blue-600 relative group"
              whileHover={{ y: -2 }}
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </motion.a>

            <motion.a
              href="#dashboard"
              className="transition hover:text-blue-600 relative group"
              whileHover={{ y: -2 }}
            >
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </motion.a>

            <motion.a
              href="#ai"
              className="transition hover:text-blue-600 relative group"
              whileHover={{ y: -2 }}
            >
              AI Tools
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </motion.a>

            <motion.a
              href="#faq"
              className="transition hover:text-blue-600 relative group"
              whileHover={{ y: -2 }}
            >
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </motion.a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-200 text-white transition-shadow">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Login
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-200 text-white transition-shadow">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 sm:px-6 py-16 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mb-6 inline-flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                <Sparkles className="mr-2 h-3 w-3" />
                AI-Powered Internship Tracker
              </Badge>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Track Every
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Application.
              </span>
              Land More Interviews.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-600">
              Manage applications, resumes, interviews, analytics and AI career
              coaching from a single dashboard built for students and job
              seekers.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-200 text-white transition-shadow"
                  >
                    Start Tracking Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
                >
                  View Demo
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="mt-12 grid grid-cols-3 gap-6 sm:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div whileHover={{ y: -5 }} className="cursor-pointer">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  2,000+
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Applications Tracked
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="cursor-pointer">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  500+
                </p>
                <p className="text-sm text-gray-600 mt-2">Students</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="cursor-pointer">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  150+
                </p>
                <p className="text-sm text-gray-600 mt-2">Interviews</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Card className="border-gray-200 bg-white shadow-2xl backdrop-blur-xl border-2">
                <div className="p-6 sm:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Dashboard Overview
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Internship Tracker
                      </h3>
                    </div>

                    <motion.div
                      className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700 font-medium"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Active
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Applications",
                        value: "127",
                        color: "from-blue-500 to-blue-600",
                      },
                      {
                        label: "Interviews",
                        value: "18",
                        color: "from-purple-500 to-purple-600",
                      },
                      {
                        label: "Offers",
                        value: "4",
                        color: "from-green-500 to-green-600",
                      },
                      {
                        label: "Response Rate",
                        value: "34%",
                        color: "from-orange-500 to-orange-600",
                      },
                    ].map((stat) => (
                      <motion.div key={stat.label} whileHover={{ y: -5 }}>
                        <Card
                          className={`border-0 bg-gradient-to-br ${stat.color}`}
                        >
                          <div className="p-4">
                            <p className="text-sm text-white/80">
                              {stat.label}
                            </p>
                            <h4 className="mt-2 text-3xl font-bold text-white">
                              {stat.value}
                            </h4>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [0, -15, 0], x: [-10, 0, -10] }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute -left-6 top-12 sm:top-20"
            >
              <Card className="border-gray-200 bg-white shadow-lg border-2">
                <div className="flex items-center gap-3 p-4">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Response Rate Increased
                    </p>
                    <p className="text-xs text-gray-500">+12% this month</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [0, 15, 0], x: [10, 0, 10] }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute -right-6 bottom-10 sm:bottom-20"
            >
              <Card className="border-gray-200 bg-white shadow-lg border-2">
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-900">
                    🎉 Interview Scheduled
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Google • Backend Intern
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Features */}
      <section
        id="features"
        className="container mx-auto px-4 sm:px-6 py-20 lg:py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-4"
          >
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              Features
            </Badge>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Everything You Need To Manage Your Internship Hunt
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Track applications, interviews, resumes and leverage AI to improve
            your chances of landing offers.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Application Tracking",
              desc: "Track every company, role, status, source and notes.",
              icon: Briefcase,
              color: "from-blue-500 to-blue-600",
            },
            {
              title: "Interview Management",
              desc: "Schedule and manage technical, HR and final rounds.",
              icon: Calendar,
              color: "from-purple-500 to-purple-600",
            },
            {
              title: "Resume Management",
              desc: "Store multiple resume versions and manage defaults.",
              icon: FileText,
              color: "from-green-500 to-green-600",
            },
            {
              title: "AI Career Coach",
              desc: "Get personalized guidance to improve your strategy.",
              icon: Brain,
              color: "from-orange-500 to-orange-600",
            },
            {
              title: "AI Insights",
              desc: "Discover what's working and what's not.",
              icon: LineChart,
              color: "from-red-500 to-red-600",
            },
            {
              title: "AI Followups",
              desc: "Generate recruiter followups instantly.",
              icon: Sparkles,
              color: "from-pink-500 to-pink-600",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
              }}
              className="group"
            >
              <Card className="h-full border-gray-200 bg-white shadow-md hover:shadow-xl transition-all overflow-hidden">
                <div className="p-6 sm:p-8">
                  <motion.div
                    className={`mb-4 inline-block p-3 rounded-lg bg-gradient-to-br ${feature.color}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-gray-600">{feature.desc}</p>

                  <motion.div
                    className="mt-4 flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 5 }}
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section
        id="dashboard"
        className="container mx-auto px-4 sm:px-6 py-20 lg:py-24"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-4"
          >
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              Dashboard Preview
            </Badge>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Your Entire Job Search In One Place
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Visualize progress, interviews, offers and application analytics
            from one dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <Card className="border-gray-200 bg-white shadow-2xl p-6 sm:p-8 border-2">
            <div className="grid gap-6 lg:grid-cols-4">
              {[
                {
                  label: "Applications",
                  value: "127",
                  icon: Briefcase,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  label: "Interviews",
                  value: "18",
                  icon: Calendar,
                  color: "from-purple-500 to-purple-600",
                },
                {
                  label: "Offers",
                  value: "4",
                  icon: TrendingUp,
                  color: "from-green-500 to-green-600",
                },
                {
                  label: "Response Rate",
                  value: "34%",
                  icon: BarChart3,
                  color: "from-orange-500 to-orange-600",
                },
              ].map((stat) => (
                <motion.div key={stat.label} whileHover={{ y: -8 }}>
                  <Card
                    className={`border-0 bg-gradient-to-br ${stat.color} text-white`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm">{stat.label}</p>
                          <h3 className="mt-2 text-4xl font-bold">
                            {stat.value}
                          </h3>
                        </div>
                        <stat.icon className="h-12 w-12 opacity-20" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <motion.div whileHover={{ y: -8 }}>
                <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 border-2">
                  <h4 className="mb-6 font-semibold text-gray-900">
                    Applications Over Time
                  </h4>

                  <div className="flex h-48 items-end gap-3">
                    {[30, 45, 80, 55, 120, 90, 140].map((height, i) => (
                      <motion.div
                        key={height}
                        className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-500 to-purple-400 relative cursor-pointer"
                        style={{
                          height: `${height}px`,
                        }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity text-sm font-semibold text-gray-900">
                          {height}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -8 }}>
                <Card className="border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 border-2">
                  <h4 className="mb-6 font-semibold text-gray-900">
                    Status Distribution
                  </h4>

                  <div className="space-y-5">
                    {[
                      ["Applied", "42%", "from-blue-500 to-blue-600"],
                      ["Interview", "21%", "from-purple-500 to-purple-600"],
                      ["Offer", "8%", "from-green-500 to-green-600"],
                      ["Rejected", "29%", "from-red-500 to-red-600"],
                    ].map(([label, value, color]) => (
                      <motion.div
                        key={label}
                        className="space-y-2 cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-medium">
                            {label}
                          </span>
                          <span
                            className={`text-white font-semibold text-sm px-3 py-1 rounded-full bg-gradient-to-r ${color}`}
                          >
                            {value}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r ${color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: value }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* AI Features */}
      <section
        id="ai"
        className="container mx-auto px-4 sm:px-6 py-20 lg:py-24"
      >
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-4"
          >
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              AI Powered
            </Badge>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Built-In AI Career Assistant
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Leverage cutting-edge AI to optimize your internship search strategy
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Brain,
              title: "AI Coach",
              desc: "Personalized internship strategy and career roadmap.",
              color: "from-blue-500 to-blue-600",
              features: ["Strategy Tips", "Career Path", "Interview Prep"],
            },
            {
              icon: LineChart,
              title: "AI Insights",
              desc: "Analyze application performance and improve response rates.",
              color: "from-purple-500 to-purple-600",
              features: [
                "Performance Metrics",
                "Trends Analysis",
                "Recommendations",
              ],
            },
            {
              icon: Sparkles,
              title: "AI Followups",
              desc: "Generate recruiter emails and LinkedIn followups instantly.",
              color: "from-orange-500 to-orange-600",
              features: [
                "Email Templates",
                "LinkedIn Messages",
                "Custom Content",
              ],
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${feature.color}`} />
                <div className="p-6 sm:p-8">
                  <motion.div
                    className={`mb-4 inline-block p-3 rounded-lg bg-gradient-to-br ${feature.color}`}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-gray-600">{feature.desc}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {feature.features.map((f) => (
                      <motion.span
                        key={f}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                      >
                        {f}
                      </motion.span>
                    ))}
                  </div>

                  <motion.div
                    className="mt-6 pt-6 border-t border-gray-100 flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 5 }}
                  >
                    Explore feature <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 sm:px-6 py-20 lg:py-24">
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-4"
          >
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              Workflow
            </Badge>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Simple Five Step Process
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Get started in minutes and begin tracking your internship search
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-5">
          {[
            { step: "Apply", icon: "✈️", desc: "Submit applications" },
            { step: "Track", icon: "📊", desc: "Track progress" },
            { step: "Analyze", icon: "🔍", desc: "Get insights" },
            { step: "Improve", icon: "⚡", desc: "Optimize strategy" },
            { step: "Get Interviews", icon: "🎯", desc: "Land interviews" },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Card className="border-gray-200 bg-gradient-to-br from-white to-blue-50 text-center backdrop-blur-xl shadow-md hover:shadow-lg transition-all h-full">
                <div className="p-6 sm:p-8">
                  <motion.div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white text-lg shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {index + 1}
                  </motion.div>

                  <h3 className="mt-4 font-bold text-gray-900 text-lg">
                    {item.step}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
                </div>
              </Card>

              {index < 4 && (
                <motion.div
                  className="hidden md:flex absolute -right-2 top-1/2 z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="h-5 w-5 text-blue-400" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
      {/* Testimonials */}
      <section className="container mx-auto px-4 sm:px-6 py-20 lg:py-24">
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-4"
          >
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              Testimonials
            </Badge>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Helping Students Stay Organized
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Track applications smarter and improve your chances of landing
            interviews.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              name: "Aarav Sharma",
              role: "Software Engineering Intern",
              text: "InternTrack AI helped me manage over 150 applications and identify where I was getting the best response rates.",
              avatar: "AS",
              color: "from-blue-400 to-blue-600",
            },
            {
              name: "Priya Verma",
              role: "Frontend Developer Intern",
              text: "The AI Insights feature showed me exactly what was working and helped me focus on better opportunities.",
              avatar: "PV",
              color: "from-purple-400 to-purple-600",
            },
            {
              name: "Rahul Mehta",
              role: "Backend Developer Intern",
              text: "Interview tracking and followups saved me countless hours. Everything stayed organized in one place.",
              avatar: "RM",
              color: "from-green-400 to-green-600",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all">
                <div className="p-6 sm:p-8 flex flex-col h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-yellow-400 text-xl"
                        whileHover={{ scale: 1.2 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>

                  <p className="text-gray-700 italic flex-grow">
                    "{testimonial.text}"
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-4">
                    <motion.div
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-white font-bold`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {testimonial.avatar}
                    </motion.div>

                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>

                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden border-gray-200 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 shadow-2xl">
            <div className="relative p-8 sm:p-12 md:p-20 text-center">
              <div className="absolute inset-0">
                <motion.div
                  className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-300/20 to-purple-300/20 blur-3xl"
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
              </div>

              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                  Ready to Organize Your
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Internship Hunt?
                  </span>
                </h2>

                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                  Join students who are tracking applications, interviews and AI
                  insights from one powerful dashboard. Start your free trial
                  today.
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Link href="/signup">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-200 text-white transition-shadow"
                      >
                        Get Started Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>

                  <Link href="/login">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
                      >
                        Login
                      </Button>
                    </motion.div>
                  </Link>
                </div>

                <p className="mt-6 text-sm text-gray-500">
                  No credit card required • Free forever plan available
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <motion.div whileHover={{ y: -3 }}>
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  InternTrack AI
                </h3>
              </Link>

              <p className="mt-3 text-sm text-gray-600">
                AI-powered internship and job application tracking platform.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -3 }}>
              <h4 className="font-semibold text-gray-900">Product</h4>

              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {["Applications", "Analytics", "Interviews", "Resumes"].map(
                  (item) => (
                    <motion.li
                      key={item}
                      whileHover={{ x: 3, color: "#2563eb" }}
                      className="cursor-pointer transition-colors hover:text-blue-600"
                    >
                      {item}
                    </motion.li>
                  ),
                )}
              </ul>
            </motion.div>

            <motion.div whileHover={{ y: -3 }}>
              <h4 className="font-semibold text-gray-900">AI Tools</h4>

              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {["AI Coach", "AI Insights", "AI Followups"].map((item) => (
                  <motion.li
                    key={item}
                    whileHover={{ x: 3, color: "#2563eb" }}
                    className="cursor-pointer transition-colors hover:text-blue-600"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div whileHover={{ y: -3 }}>
              <h4 className="font-semibold text-gray-900">Company</h4>

              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {["About", "Contact", "Privacy", "Terms"].map((item) => (
                  <motion.li
                    key={item}
                    whileHover={{ x: 3, color: "#2563eb" }}
                    className="cursor-pointer transition-colors hover:text-blue-600"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p>
              © {new Date().getFullYear()} InternTrack AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-xs"
                  whileHover={{ scale: 1.1 }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </main>
  );
}
