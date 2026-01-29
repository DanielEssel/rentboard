"use client";

import { motion } from "framer-motion";
import { 
  Target, 
  Eye, 
  Heart,
  Users,
  Home,
  Shield,
  Award,
  TrendingUp,
  CheckCircle2,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TopHeader from "@/components/TopHeader";
import Footer from "@/components/Footer";

// Animation variant
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Company Stats
const stats = [
  { number: "5,000+", label: "Properties Listed", icon: Home },
  { number: "15,000+", label: "Happy Tenants", icon: Users },
  { number: "3,000+", label: "Trusted Landlords", icon: Shield },
  { number: "98%", label: "Satisfaction Rate", icon: Award }
];

// Core Values
const values = [
  {
    icon: Shield,
    title: "Trust & Security",
    description: "We verify every property and user to ensure a safe rental experience for all parties involved."
  },
  {
    icon: Heart,
    title: "Customer First",
    description: "Your satisfaction is our priority. We provide 24/7 support to help you through every step of your journey."
  },
  {
    icon: CheckCircle2,
    title: "Transparency",
    description: "No hidden fees, no surprises. We believe in clear communication and honest business practices."
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We continuously improve our platform with the latest technology to make renting easier and more efficient."
  }
];

// Why Choose Us
const features = [
  {
    title: "Verified Listings",
    description: "Every property is inspected and verified by our team to ensure quality and legitimacy."
  },
  {
    title: "Professional Support",
    description: "Our experienced agents guide you through viewings, applications, and move-in processes."
  },
  {
    title: "Secure Platform",
    description: "Advanced security measures protect your personal information and transactions."
  },
  {
    title: "Easy Process",
    description: "Our streamlined system makes finding or listing properties quick and hassle-free."
  },
  {
    title: "Fair Pricing",
    description: "Competitive rates with no hidden costs. What you see is what you pay."
  },
  {
    title: "Wide Coverage",
    description: "Properties across Ghana in major cities and growing communities."
  }
];

export default function AboutPage() {
  return (
    <main className="font-sans bg-white">
      <TopHeader />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#006D77] to-[#004a54] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About TownWrent
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
              Ghana's trusted platform connecting landlords and tenants through 
              verified listings, professional support, and transparent processes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              variants={fadeIn}
              className="bg-gradient-to-br from-[#006D77] to-[#005662] text-white p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-[#FFD166]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-100 leading-relaxed">
                To revolutionize the property rental experience in Ghana by providing 
                a secure, transparent, and efficient platform that connects landlords 
                with quality tenants while ensuring trust and satisfaction for all parties.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              variants={fadeIn}
              className="bg-gradient-to-br from-[#FFD166] to-[#ffc940] text-[#006D77] p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-white/30 rounded-xl flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-[#006D77]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-[#005662] leading-relaxed">
                To become Ghana's leading property rental platform, setting the standard 
                for trust, innovation, and customer service while expanding access to 
                quality housing across the nation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Growing together with Ghana's rental community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeIn}
                className="bg-white p-6 rounded-xl text-center border-2 border-gray-100 hover:border-[#006D77]/20 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-[#006D77] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#006D77] mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeIn}
                className="flex gap-4 p-6 bg-gray-50 rounded-xl border-2 border-gray-100 hover:border-[#006D77]/20 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#006D77] rounded-lg flex items-center justify-center flex-shrink-0">
                  <value.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose TownWrent
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              What sets us apart in the property rental market
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeIn}
                className="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-[#006D77]/20 hover:shadow-lg transition-all"
              >
                <div className="w-3 h-3 bg-[#FFD166] rounded-full mb-4"></div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-left md:text-center">
              <p>
                TownWrent was founded with a simple vision: to make property rental in Ghana 
                easier, safer, and more transparent for everyone. We recognized the challenges 
                both landlords and tenants faced in the traditional rental market—lack of trust, 
                inefficient processes, and limited access to verified information.
              </p>
              <p>
                Today, we've grown into Ghana's trusted rental platform, connecting thousands 
                of landlords with quality tenants every month. Our team of dedicated professionals 
                works tirelessly to verify every listing, support every transaction, and ensure 
                satisfaction for all parties involved.
              </p>
              <p>
                We're more than just a platform—we're your partner in finding the perfect home 
                or the ideal tenant. With cutting-edge technology, local expertise, and a 
                commitment to excellence, we're transforming the rental experience across Ghana.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 px-6 bg-[#006D77] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-100 text-lg mb-10">
            Have questions or want to learn more about TownWrent? We'd love to hear from you.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            <a 
              href="tel:+233245258015"
              className="flex flex-col items-center gap-3 p-6 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <Phone className="h-8 w-8 text-[#FFD166]" />
              <div>
                <div className="text-sm text-gray-300 mb-1">Phone</div>
                <div className="font-semibold">+233 245 258 015</div>
              </div>
            </a>

            <a 
              href="mailto:info@townwrent.com"
              className="flex flex-col items-center gap-3 p-6 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <Mail className="h-8 w-8 text-[#FFD166]" />
              <div>
                <div className="text-sm text-gray-300 mb-1">Email</div>
                <div className="font-semibold">info@townwrent.com</div>
              </div>
            </a>

            <div className="flex flex-col items-center gap-3 p-6 bg-white/10 rounded-xl border border-white/20">
              <MapPin className="h-8 w-8 text-[#FFD166]" />
              <div>
                <div className="text-sm text-gray-300 mb-1">Location</div>
                <div className="font-semibold">Accra, Ghana</div>
              </div>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFD166] text-[#006D77] font-bold rounded-lg hover:bg-[#ffc940] transition-all"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}