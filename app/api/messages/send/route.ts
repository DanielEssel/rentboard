// /app/api/messages/send/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const body = await req.json();
    const { property_id, receiver_id, message } = body;

    // validate
    if (!property_id || !receiver_id || !message || message.trim() === "") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // get auth user (sender)
    const { data: sessionData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !sessionData?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const sender_id = sessionData.user.id;

    // insert
    const { data, error } = await supabase
      .from("messages")
      .insert({
        property_id,
        sender_id,
        receiver_id,
        message,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert message error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: data });
  } catch (err: any) {
    console.error("Route error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
