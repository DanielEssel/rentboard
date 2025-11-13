"use client"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { Home, Users, MapPin, TrendingUp } from "lucide-react"
import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"

const stats = [
  {
    Icon: Home,
    value: 500,
    suffix: "+",
    label: "Properties Listed",
    description: "Verified rental homes"
  },
  {
    Icon: Users,
    value: 1200,
    suffix: "+",
    label: "Happy Tenants",
    description: "Successfully housed"
  },
  {
    Icon: MapPin,
    value: 15,
    suffix: "+",
    label: "Locations",
    description: "Across Awutu Senya"
  },
  {
    Icon: TrendingUp,
    value: 95,
    suffix: "%",
    label: "Success Rate",
    description: "Tenant satisfaction"
  }
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" })
      return controls.stop
    }
  }, [isInView, count, value])

  return (
    <h3 ref={ref} className="text-4xl font-bold text-[#006D77] mb-2">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </h3>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export default function StatsSection() {
  return (
    <motion.section 
      className="py-20 px-6 bg-white text-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.div 
        className="max-w-6xl mx-auto text-center mb-12"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.15 } }
        }}
      >
        <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connecting tenants with quality homes across Awutu Senya East
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="relative group"
          >
            <div className="bg-gradient-to-br from-[#E0FBFC] to-white border-2 border-[#006D77]/10 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#006D77] rounded-full mb-4 group-hover:scale-110 transition-transform">
                <stat.Icon className="w-8 h-8 text-white" />
              </div>
              
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="font-semibold text-gray-800 mb-1">
                {stat.label}
              </p>
              <p className="text-sm text-gray-600">
                {stat.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}