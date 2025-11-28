"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Profile = {
  id: string;
  full_name?: string | null;
};

type Message = {
  id: string;
  message: string;
  created_at: string;
  property_id: string;
  sender_id: string;
  receiver_id: string;
  sender: Profile | null;
  receiver: Profile | null;
};

export default function MessageDetail() {
  const { id } = useParams();
  const messageId = id as string | undefined;

  const [msg, setMsg] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  /* ---------------------------------------------------------
     Load SINGLE message
  --------------------------------------------------------- */
  const loadMessage = async () => {
    if (!messageId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        id,
        message,
        created_at,
        property_id,
        sender_id,
        receiver_id,
        sender:profiles!messages_sender_id_fkey ( id, full_name ),
        receiver:profiles!messages_receiver_id_fkey ( id, full_name )
      `
      )
      .eq("id", messageId)
      .maybeSingle();

    if (error) {
      console.error("Error loading message:", error);
      setMsg(null);
    } else if (data) {
      setMsg({
        ...data,
        sender: Array.isArray(data.sender) ? data.sender[0] || null : data.sender,
        receiver: Array.isArray(data.receiver) ? data.receiver[0] || null : data.receiver,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMessage();
  }, [messageId]);

  /* ---------------------------------------------------------
     Send Reply
  --------------------------------------------------------- */
  const handleReply = async () => {
    if (!replyText.trim() || !msg) return;

    setSending(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const sender_id = session?.user?.id;
      if (!sender_id) throw new Error("Not authenticated");

      const { error } = await supabase.from("messages").insert({
        property_id: msg.property_id,
        sender_id,
        receiver_id: msg.sender_id, // reply goes back to sender
        message: replyText.trim(),
      });

      if (error) throw error;

      setReplyText("");
      loadMessage();
    } catch (err: any) {
      console.error("Reply error:", err);
      alert(err.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */

  if (loading) return <div className="text-gray-600">Loading...</div>;
  if (!msg) return <div className="text-gray-600">Message not found.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Message Details</h1>

      {/* ---------------- Message Box ---------------- */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div>
          <div className="font-semibold">{msg.sender?.full_name || "Unknown Sender"}</div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(msg.created_at).toLocaleString()}
          </div>
        </div>

        <p className="mt-4 text-gray-700 whitespace-pre-line">{msg.message}</p>
      </div>

      {/* ---------------- Reply Box ---------------- */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">
          Reply to {msg.sender?.full_name || "sender"}
        </h2>

        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4}
          className="w-full border rounded-lg p-3"
          placeholder="Write your reply..."
        />

        <Button onClick={handleReply} disabled={sending}>
          {sending ? "Sending..." : "Send Reply"}
        </Button>
      </div>
    </div>
  );
}
