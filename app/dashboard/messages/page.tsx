"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type Sender = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

type Message = {
  id: string;
  message: string;
  created_at: string;
  property_id: string;
  sender_id: string;
  sender: Sender | null;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    // (Optional) Add realtime subscription later
  }, []);

  const fetchMessages = async () => {
    setLoading(true);

    // Grab current user ID
   const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      setMessages([]);
      setLoading(false);
      return;
    }

   const { data, error } = await supabase
  .from("messages")
  .select(`
    id,
    message,
    created_at,
    property_id,
    sender_id,
    sender:profiles!messages_sender_id_fkey ( id, full_name )
  `)
  .eq("receiver_id", userId)
  .order("created_at", { ascending: false });



    if (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } else {
      setMessages((data as any[]).map((m) => ({
  ...m,
  sender: Array.isArray(m.sender) ? m.sender[0] : m.sender
})));
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="text-gray-600">Loading messages...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#023047]">Messages</h1>
      <p className="text-gray-600">Messages received for your properties</p>

      <div className="space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-500">No messages yet.</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            {/* Sender + message text */}
            <div>
              <div className="font-semibold">
                {msg.sender?.full_name || "Unknown Sender"}
              </div>

              <p className="text-gray-600 mt-1 line-clamp-2">
                “{msg.message}”
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/messages/${msg.id}`}
                className="text-[#006D77] font-semibold hover:underline"
              >
                View
              </Link>

              <Link
                href={`/dashboard/properties/${msg.property_id}`}
                className="text-sm sm:text-base text-gray-500 hover:underline"
              >
                View Property
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
