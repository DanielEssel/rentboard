"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Home, Users, MapPin, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { easeOut } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.4, ease: easeOut } 
  },
};



const stats = [
  { Icon: Home, value: 500, suffix: "+", label: "Properties Listed", description: "Verified rental homes" },
  { Icon: Users, value: 1200, suffix: "+", label: "Happy Tenants", description: "Successfully housed" },
  { Icon: MapPin, value: 15, suffix: "+", label: "Locations", description: "Across Awutu Senya" },
  { Icon: TrendingUp, value: 95, suffix: "%", label: "Success Rate", description: "Tenant satisfaction" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count, value]);

  return (
    <h3 ref={ref} className="text-2xl sm:text-3xl font-bold text-[#006D77] mb-1">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </h3>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};



export default function StatsSection() {
  return (
    <motion.section
      className="py-12 px-4 sm:py-16 sm:px-6 bg-gray-50 text-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Section Header*/}
      <motion.div
        className="max-w-3xl mx-auto text-center mb-8 sm:mb-12"
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5 } },
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Our Impact in Numbers</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Connecting tenants with quality homes across Awutu Senya East
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto"
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <div className="bg-white shadow-md rounded-xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:scale-105">
              <motion.div
                className="inline-flex items-center justify-center w-12 h-12 bg-[#006D77] rounded-full mb-3"
                whileHover={{ scale: 1.15 }}
              >
                <stat.Icon className="w-6 h-6 text-white" />
              </motion.div>

              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="font-semibold text-gray-800 text-sm mb-0.5">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
