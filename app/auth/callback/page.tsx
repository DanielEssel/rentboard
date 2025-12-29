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
        const returnTo = params.get("returnTo") || "/";

        // 🔥 Wait for Supabase to fully write the session to localStorage
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 🔥 Get session
        const { data } = await supabase.auth.getSession();

        // 🔥 Restore form draft (if any)
        const savedForm = localStorage.getItem("postPropertyForm");
        const savedStep = localStorage.getItem("postPropertyStep");

        if (savedForm) {
          localStorage.setItem("postPropertyForm", savedForm);
        }
        if (savedStep) {
          localStorage.setItem("postPropertyStep", savedStep);
        }

        // 🔥 Redirect depending on session status
        if (data.session) {
          router.replace(returnTo); // correct redirect
        } else {
          router.replace("/auth/login");
        }
      } catch (err) {
        console.error("Callback error:", err);
        router.replace("/auth/login");
      }
    };

    processSession();
  }, [router, params]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-r-transparent" />
        <p className="text-lg text-gray-700">Finalizing login...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
