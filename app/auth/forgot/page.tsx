"use client"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowRight, Check, ArrowLeft, Shield } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

function ForgotPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    if (!email) {
      setError("Please enter your email address")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password?returnTo=${returnTo}`
      })

      if (error) throw error

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-yellow-50 p-4">
      {/* Back Button */}
      <Link 
        href="/auth/login"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm hover:shadow-md"
      >
        <ArrowLeft className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Back to Login</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#006D77] to-[#005662] p-12 flex-col justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Password<br />Recovery
              </h2>
              <div className="w-20 h-1 bg-[#FFD166] rounded-full mb-6"></div>
              <p className="text-teal-100 text-lg leading-relaxed mb-8">
                Don't worry! It happens to the best of us. We'll help you get back to your account.
              </p>
            </motion.div>

            {/* Security Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {[
                "Secure password reset process",
                "Email verification required",
                "Your data stays protected",
                "Quick and easy recovery"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#FFD166] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#006D77]" />
                  </div>
                  <p className="text-white">{feature}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD166] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 relative z-10 flex items-center gap-3"
          >
            <Shield className="w-8 h-8 text-[#FFD166]" />
            <div>
              <p className="text-sm text-teal-100">Secure & Safe</p>
              <p className="text-lg font-bold text-white">256-bit Encryption</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#006D77]">TownWrent</h1>
            <div className="w-16 h-1 bg-[#FFD166] mx-auto rounded-full mt-2"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {!success ? (
              <>
                <h2 className="text-3xl font-bold text-[#006D77] mb-2">Forgot Password?</h2>
                <p className="text-gray-600 mb-8">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#006D77] text-white font-semibold py-3 rounded-xl hover:bg-[#005662] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                    {!loading && (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </motion.button>
                </div>

                {/* Info Box */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-100"
                >
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-[#006D77]">💡 Tip:</span> Check your spam folder if you don't see the email in your inbox within a few minutes.
                  </p>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {/* Success Icon */}
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-[#006D77] mb-3">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent password reset instructions to:
                </p>
                <p className="text-lg font-semibold text-[#006D77] mb-8">
                  {email}
                </p>

                <div className="bg-teal-50 rounded-xl p-4 mb-6 text-left">
                  <h3 className="font-semibold text-[#006D77] mb-2">What's next?</h3>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-[#006D77] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span>Check your email inbox (and spam folder)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-[#006D77] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span>Click the reset link in the email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-[#006D77] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span>Create your new password</span>
                    </li>
                  </ol>
                </div>

                <button
                  onClick={() => setSuccess(false)}
                  className="text-[#006D77] font-semibold hover:text-[#005662] hover:underline text-sm"
                >
                  Didn't receive the email? Try again
                </button>
              </motion.div>
            )}

            {/* Back to Login */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#006D77] font-semibold hover:text-[#005662] hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-yellow-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#006D77] border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  )
}