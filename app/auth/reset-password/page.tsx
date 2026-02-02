"use client"
import { useState, useEffect, Suspense, ChangeEvent, KeyboardEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, Eye, EyeOff, ArrowRight, Check, Shield, KeyRound, AlertCircle } from "lucide-react"

// Mock supabase client for demo - replace with your actual import
const supabase = {
  auth: {
    // mock setSession to mirror the real Supabase client API used in this file
    setSession: async (session: { access_token?: string; refresh_token?: string }) => {
      // This is a mock - your actual implementation will use the real Supabase client
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { session: null }, error: null })
        }, 100)
      })
    },
    updateUser: async ({ password }: { password: string }) => {
      // This is a mock - your actual implementation will use the real Supabase client
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { user: {} }, error: null })
        }, 1000)
      })
    }
  }
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/auth/login'

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Check if we have the required tokens from URL hash (fragment) or query params
    let accessToken = searchParams.get('access_token') || searchParams.get('token')
    let type = searchParams.get('type')
    
    // If not in query params, check the URL hash/fragment
    if (!accessToken && typeof window !== 'undefined') {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      accessToken = hashParams.get('access_token') || hashParams.get('token')
      type = hashParams.get('type')
    }
    
    if (!accessToken || type !== 'recovery') {
      setTokenError(true)
      setError("Invalid or missing reset link. Please request a new password reset email.")
    }
  }, [searchParams])
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError("") // Clear errors on input
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    const { password, confirmPassword } = formData

    // Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError("")

    try {
      // First, get the tokens from URL (query or hash)
      let accessToken = searchParams.get('access_token')
      let refreshToken = searchParams.get('refresh_token')
      
      if (!accessToken && typeof window !== 'undefined') {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        accessToken = hashParams.get('access_token')
        refreshToken = hashParams.get('refresh_token')
      }

      // If we have tokens in the URL, set the session first
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        }) as { data: any; error: any }
        
        if (sessionError) throw sessionError
      }

      // Now update the password
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: password 
      }) as { data: any; error: any }

      if (updateError) throw updateError

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push(returnTo)
      }, 2000)
    } catch (err: any) {
      console.error('Password reset error:', err)
      
      // Handle specific error cases
      if (err.message?.includes('session')) {
        setError("Your reset link has expired or is invalid. Please request a new password reset email.")
        setTokenError(true)
      } else {
        setError(err.message || "Failed to reset password. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "bg-gray-200" }
    if (password.length < 6) return { strength: 1, text: "Weak", color: "bg-red-500" }
    if (password.length < 10) return { strength: 2, text: "Fair", color: "bg-yellow-500" }
    return { strength: 3, text: "Strong", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-yellow-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-teal-700 to-teal-800 p-12 flex-col justify-between">
          <div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Create New<br />Password
              </h2>
              <div className="w-20 h-1 bg-yellow-400 rounded-full mb-6"></div>
              <p className="text-teal-100 text-lg leading-relaxed mb-8">
                Choose a strong password to secure your TownWrent account.
              </p>
            </div>

            {/* Password Tips */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg mb-3">Password Tips:</h3>
              {[
                "Use at least 6 characters",
                "Mix uppercase and lowercase",
                "Include numbers or symbols",
                "Avoid common words or patterns"
              ].map((tip, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-teal-800" />
                  </div>
                  <p className="text-white">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          {/* Security Badge */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 relative z-10 flex items-center gap-3">
            <Shield className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-sm sm:text-base text-teal-100">Secure & Safe</p>
              <p className="text-lg font-bold text-white">256-bit Encryption</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-teal-700">TownWrent</h1>
            <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full mt-2"></div>
          </div>

          <div>
            {!success ? (
              <>
                {/* Header with Icon */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <KeyRound className="w-6 h-6 text-teal-700" />
                  </div>
                  <h2 className="text-3xl font-bold text-teal-700">Reset Password</h2>
                </div>
                <p className="text-gray-600 mb-8">
                  Enter your new password below
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm sm:text-base flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{error}</p>
                      {tokenError && (
                        <Link 
                          href="/auth/forgot" 
                          className="underline font-medium mt-2 inline-block hover:text-red-800"
                        >
                          Request new reset link
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {/* New Password Input */}
                  <div>
                    <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-all"
                        required
                        disabled={loading || tokenError}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading || tokenError}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                level <= passwordStrength.strength
                                  ? passwordStrength.color
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          Password strength: <span className="font-medium">{passwordStrength.text}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-all"
                        required
                        disabled={loading || tokenError}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading || tokenError}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {formData.confirmPassword && (
                      <div className="mt-2">
                        {formData.password === formData.confirmPassword ? (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Passwords match
                          </p>
                        ) : (
                          <p className="text-xs text-red-600">
                            Passwords do not match
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading || tokenError}
                    className="w-full bg-teal-700 text-white font-semibold py-3 rounded-xl hover:bg-teal-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Resetting Password..." : "Reset Password"}
                    {!loading && (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>

                {/* Info Box */}
                {!tokenError && (
                  <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <p className="text-sm sm:text-base text-gray-700">
                      <span className="font-semibold text-teal-700">🔒 Secure:</span> Your password is encrypted and never stored in plain text.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                {/* Success Icon */}
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-teal-700 mb-3">Password Reset!</h2>
                <p className="text-gray-600 mb-6">
                  Your password has been successfully reset.
                </p>

                <div className="bg-teal-50 rounded-xl p-4 mb-6">
                  <p className="text-sm sm:text-base text-gray-700">
                    Redirecting you to your login...
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-teal-700">
                  <div className="w-2 h-2 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}

            {/* Back to Login */}
            {!success && (
              <div className="mt-8 text-center">
                <p className="text-sm sm:text-base text-gray-600">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-teal-700 font-semibold hover:text-teal-800 hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-yellow-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-700 border-r-transparent" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}