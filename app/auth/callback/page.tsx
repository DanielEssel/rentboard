
export const dynamic = "force-dynamic";


"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const returnTo = params.get("returnTo") || "/"

    const processSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (data.session) {
        router.push(returnTo)
      } else {
        router.push("/auth/login")
      }
    }

    processSession()
  }, [])

  return <p>Signing you in...</p>
}
