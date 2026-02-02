// app/auth/callback/complete/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const processSession = async () => {
      try {
        const returnTo = params.get("returnTo") || "/dashboard";

        // Wait for session to be fully persisted
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Verify we have a valid session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          router.replace("/auth/login?error=session_failed");
          return;
        }

        if (!data.session) {
          console.warn("No session found after callback");
          router.replace("/auth/login?error=no_session");
          return;
        }

        // Session is valid - restore any saved form data
        const savedForm = localStorage.getItem("postPropertyForm");
        const savedStep = localStorage.getItem("postPropertyStep");

        if (savedForm) {
          console.log("Restored property form draft");
        }
        if (savedStep) {
          console.log("Restored property form step");
        }

        // Success! Redirect to destination
        console.log("Login successful, redirecting to:", returnTo);
        router.replace(returnTo);
      } catch (err) {
        console.error("Callback processing error:", err);
        router.replace("/auth/login?error=callback_failed");
      }
    };

    processSession();
  }, [router, params]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-yellow-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#006D77] border-r-transparent" />
        <p className="text-lg font-medium text-gray-700">Completing sign in...</p>
        <p className="text-sm sm:text-base text-gray-500 mt-2">Please wait a moment</p>
      </div>
    </div>
  );
}

export default function AuthCallbackComplete() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-yellow-50">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#006D77] border-r-transparent" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}