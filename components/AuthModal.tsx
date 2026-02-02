"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertCircle, X, LogIn, UserPlus } from "lucide-react";

export default function AuthModal({
  open,
  onClose,
  onSuccess, // optional callback
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  /** -------------------------------------------------------
   * CLOSE ON ESC
   ---------------------------------------------------------*/
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  /** -------------------------------------------------------
   * SAFELY PERSIST FORM BEFORE REDIRECTING (important)
   *
   * This guarantees form + step remains exactly where user
   * left off even after Supabase login redirect.
   ---------------------------------------------------------*/
  const persistFormBeforeRedirect = () => {
    try {
      const draftForm = localStorage.getItem("postPropertyForm");
      const draftStep = localStorage.getItem("postPropertyStep");

      if (draftForm) localStorage.setItem("postPropertyForm", draftForm);
      if (draftStep) localStorage.setItem("postPropertyStep", draftStep);
    } catch (e) {
      console.warn("Failed to persist form draft before auth:", e);
    }
  };

  /** -------------------------------------------------------
   * REDIRECT HANDLER WITH returnTo
   ---------------------------------------------------------*/
  const goTo = (path: string) => {
    persistFormBeforeRedirect();

    // Close the modal before navigating
    onClose();

    // Ensure auth callback knows where to return
    router.push(`${path}?returnTo=/list-property`);
  };

  const handleSignIn = () => goTo("/auth/login");
  const handleSignUp = () => goTo("/auth/signup");

  /** -------------------------------------------------------
   * UI RENDER
   ---------------------------------------------------------*/
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.45 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              z-50 w-[calc(100%-2rem)] sm:w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

              {/* Header */}
              <div className="bg-gradient-to-r from-[#006D77] to-[#005662] px-6 py-5 relative">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-5 w-5" />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg">Authentication Required</h3>
                    <p className="text-teal-100 text-sm sm:text-base">Please sign in to continue</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white 
                    transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                  To Post A Property on TownWrent, you need to create an account or sign in.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleSignIn}
                    className="w-full bg-[#006D77] text-white px-6 py-3 rounded-xl 
                      font-semibold flex items-center justify-center gap-2 
                      hover:bg-[#005662] transition-all duration-300 shadow-lg"
                  >
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </button>

                  <button
                    onClick={handleSignUp}
                    className="w-full bg-white text-[#006D77] px-6 py-3 rounded-xl 
                      font-semibold border-2 border-[#006D77] hover:bg-[#006D77] 
                      hover:text-white transition-all duration-300 flex items-center 
                      justify-center gap-2"
                  >
                    <UserPlus className="h-5 w-5" />
                    Create Account
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500 font-medium">OR</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base py-2"
                >
                  Continue Browsing
                </button>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  By signing in, you agree to our{" "}
                  <a href="/terms" className="text-[#006D77] hover:underline font-medium">Terms</a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-[#006D77] hover:underline font-medium">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
