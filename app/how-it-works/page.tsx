"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Calendar, 
  FileCheck, 
  Key, 
  Upload, 
  UserCheck, 
  MessageSquare, 
  Home,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  Phone,
  Mail
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TopHeader from "@/components/TopHeader";
import Footer from "@/components/Footer";

// Simple animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Tenant Journey Steps
const tenantSteps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse verified property listings across Ghana with filters for budget, location, and amenities."
  },
  {
    icon: Calendar,
    title: "Schedule Viewing",
    description: "Book property tours at your convenience with our professional agents."
  },
  {
    icon: FileCheck,
    title: "Apply Online",
    description: "Submit your application and required documents securely through our platform."
  },
  {
    icon: Key,
    title: "Move In",
    description: "Complete the agreement, make payments, and collect your keys hassle-free."
  }
];

// Landlord Journey Steps
const landlordSteps = [
  {
    icon: Upload,
    title: "List Your Property",
    description: "Create a detailed listing with photos, descriptions, and rental terms easily."
  },
  {
    icon: UserCheck,
    title: "Get Verified",
    description: "Our team verifies your property and ownership to build trust with tenants."
  },
  {
    icon: MessageSquare,
    title: "Connect with Tenants",
    description: "Receive applications from pre-screened tenants and communicate directly."
  },
  {
    icon: Home,
    title: "Finalize & Rent",
    description: "Complete rental agreements with our support and secure payment collection."
  }
];

// Benefits
const benefits = [
  {
    icon: Shield,
    title: "100% Verified",
    description: "All properties and users verified for safety"
  },
  {
    icon: Clock,
    title: "Quick Process",
    description: "Streamlined rental process with support"
  },
  {
    icon: CheckCircle2,
    title: "Transparent",
    description: "No hidden fees, clear terms for all"
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Always available to assist you"
  }
];

export default function HowItWorksPage() {
  return (
    <main className="font-sans bg-white">
      <TopHeader />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#006D77] to-[#004a54] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How TownWrent Works
          </h1>
          
          <p className="text-lg text-gray-100 mb-10 max-w-2xl mx-auto">
            Whether you're searching for your dream home or listing a property, 
            we've made the process simple and secure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="px-8 py-4 bg-[#FFD166] text-[#006D77] font-bold rounded-lg hover:bg-[#ffc940] transition-all inline-flex items-center justify-center gap-2"
            >
              I'm Looking for a Home
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/list-property"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
            >
              I'm a Landlord
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* For Tenants Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              For Tenants
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find your perfect home in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tenantSteps.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                variants={fadeIn}
                className="bg-gray-50 p-6 rounded-xl border-2 border-gray-100 hover:border-[#006D77]/20 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#006D77] rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Landlords Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              For Landlords
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              List and rent your property with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {landlordSteps.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                variants={fadeIn}
                className="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-[#FFD166]/30 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#FFD166] rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="h-7 w-7 text-[#006D77]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose TownWrent
            </h2>
            <p className="text-gray-600">
              Safe, efficient, and transparent property rental
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl text-center border-2 border-gray-100 hover:border-[#006D77]/20 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-[#006D77] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#006D77] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-100 text-lg mb-10">
            Join thousands who have found their perfect homes or tenants through TownWrent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/explore"
              className="px-8 py-4 bg-[#FFD166] text-[#006D77] font-bold rounded-lg hover:bg-[#ffc940] transition-all inline-flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              Browse Properties
            </Link>
            <Link
              href="/list-property"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5" />
              List Your Property
            </Link>
          </div>

          <div className="pt-8 border-t border-white/20">
            <p className="text-gray-200 mb-4">Need help? Contact us</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="tel:+233245258015"
                className="flex items-center gap-2 text-white hover:text-[#FFD166] transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>+233 245 258 015</span>
              </a>
              <span className="hidden sm:inline text-white/30">|</span>
              <a 
                href="mailto:info@townwrent.com"
                className="flex items-center gap-2 text-white hover:text-[#FFD166] transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>info@townwrent.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}