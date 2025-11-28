"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useNotifications(userId: string | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("messages")
      .select("id, message, created_at, property_id, sender_id, receiver_id, is_read")
      .eq("receiver_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      setMessages(data);
      setUnreadCount(data.filter(m => !m.is_read).length);
    }
  };

  // realtime listener
  useEffect(() => {
    if (!userId) return;

    fetchMessages();

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          setMessages(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { messages, unreadCount, fetchMessages };
}
