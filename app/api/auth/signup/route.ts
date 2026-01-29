// /app/api/auth/sign-up/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const data = await req.json();

  const { email, password, full_name } = data;

  const { data: authData, error } = await (await supabase).auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
    },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ user: authData.user });
}
