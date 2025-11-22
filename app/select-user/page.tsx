"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Home, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SelectUserPage() {
  const [role, setRole] = useState<"tenant" | "landlord" | null>(null)
  const router = useRouter()

  useEffect(() => {
    const existingRole = localStorage.getItem("userRole")
    if (existingRole) {
      router.push(existingRole === "tenant" ? "/explore" : "/list-property")
    }
  }, [router])

  const handleContinue = () => {
    if (!role) return
    localStorage.setItem("userRole", role)
    router.push(role === "tenant" ? "/explore" : "/list-property")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-yellow-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl px-5 py-6 sm:px-10 sm:py-10 w-full max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2 sm:mb-3"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-[#006D77] mb-2">
              Welcome to TownWrent
            </h1>
            <div className="w-16 h-1 bg-[#FFD166] mx-auto rounded-full"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-sm sm:text-base"
          >
            Choose your role below
          </motion.p>
        </div>

        {/* Role Selection Cards */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRole("tenant")}
            className={`cursor-pointer flex flex-col items-center justify-center p-5 sm:p-6 border-2 rounded-2xl w-full sm:w-1/2 transition-all ${
              role === "tenant"
                ? "border-[#006D77] bg-teal-50 shadow-lg ring-2 ring-[#006D77] ring-opacity-50"
                : "border-gray-200 hover:border-[#006D77] hover:shadow-md"
            }`}
          >
            <div
              className={`p-2.5 sm:p-3 rounded-full mb-2 sm:mb-3 ${
                role === "tenant" ? "bg-[#006D77]" : "bg-gray-100"
              }`}
            >
              <Home
                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  role === "tenant" ? "text-white" : "text-[#006D77]"
                }`}
              />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1">I'm a Tenant</h3>
            <p className="text-xs text-gray-600 text-center">
              Looking for a verified place
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRole("landlord")}
            className={`cursor-pointer flex flex-col items-center justify-center p-5 sm:p-6 border-2 rounded-2xl w-full sm:w-1/2 transition-all ${
              role === "landlord"
                ? "border-[#FFD166] bg-yellow-50 shadow-lg ring-2 ring-[#FFD166] ring-opacity-50"
                : "border-gray-200 hover:border-[#FFD166] hover:shadow-md"
            }`}
          >
            <div
              className={`p-2.5 sm:p-3 rounded-full mb-2 sm:mb-3 ${
                role === "landlord" ? "bg-[#FFD166]" : "bg-gray-100"
              }`}
            >
              <User
                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  role === "landlord" ? "text-[#006D77]" : "text-[#FFD166]"
                }`}
              />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1">
              I'm a Landlord
            </h3>
            <p className="text-xs text-gray-600 text-center">
              Want to list properties
            </p>
          </motion.div>
        </div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleContinue}
          disabled={!role}
          className={`w-full font-semibold py-3 rounded-xl transition-all text-sm sm:text-base ${
            role
              ? "bg-[#006D77] text-white hover:bg-[#005662] shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {role ? "Continue" : "Select a role to continue"}
        </motion.button>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-4 sm:mt-6"
        >
          <p className="text-xs text-gray-500">
            Connecting tenants with verified properties
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © {new Date().getFullYear()} TownWrent
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}