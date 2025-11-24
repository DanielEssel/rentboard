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
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth error:", error);
          router.push("/auth/login");
          return;
        }

        if (data.session) {
          router.push(returnTo);
        } else {
          router.push("/auth/login");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        router.push("/auth/login");
      }
    };

    processSession();
  }, [router, params]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="text-lg">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}