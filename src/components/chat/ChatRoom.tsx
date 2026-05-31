"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Send,
  Paperclip,
  MessageSquareDashed,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { StatusBadge } from "@/components/StatusBadge";
import { formatVND } from "@/lib/utils";
import type { Message, Profile, Project, ProjectStatus } from "@/lib/types";

type SenderMap = Record<string, Pick<Profile, "full_name" | "role" | "avatar_url">>;

export function ChatRoom({
  roomId,
  currentUserId,
  isAdmin,
  project,
}: {
  roomId: string;
  currentUserId: string;
  isAdmin: boolean;
  project: Project;
}) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [senders, setSenders] = useState<SenderMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [accepted, setAccepted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Resolve sender profile info for a set of ids we don't know yet.
  const ensureSenders = useCallback(
    async (ids: string[]) => {
      const missing = ids.filter((id) => id && !senders[id]);
      if (missing.length === 0) return;
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, role, avatar_url")
        .in("id", missing);
      if (data) {
        setSenders((prev) => {
          const next = { ...prev };
          for (const p of data) {
            next[p.id] = {
              full_name: p.full_name,
              role: p.role,
              avatar_url: p.avatar_url,
            };
          }
          return next;
        });
      }
    },
    [senders, supabase]
  );

  // Initial load
  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: err } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (!active) return;
      if (err) {
        setError("Không tải được tin nhắn.");
        setLoading(false);
        return;
      }
      setMessages(data as Message[]);
      const ids = Array.from(
        new Set((data as Message[]).map((m) => m.sender_id).filter(Boolean))
      ) as string[];
      await ensureSenders(ids);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const msg = payload.new as Message;
          if (msg.sender_id) await ensureSenders([msg.sender_id]);
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function sendText() {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    setText("");
    const { error: err } = await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: currentUserId,
      content,
      message_type: "text",
    });
    if (err) {
      setError("Gửi tin nhắn thất bại.");
      setText(content);
    }
    setSending(false);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const path = `${roomId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("project-files")
        .upload(path, file);
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage
        .from("project-files")
        .getPublicUrl(path);

      await supabase.from("messages").insert({
        room_id: roomId,
        sender_id: currentUserId,
        content: file.name,
        message_type: "file",
        file_url: pub.publicUrl,
      });

      // Record in project_files too.
      await supabase.from("project_files").insert({
        project_id: project.id,
        uploaded_by: currentUserId,
        file_url: pub.publicUrl,
        file_name: file.name,
        file_type: file.type,
      });
    } catch {
      setError("Upload thất bại. Kiểm tra Storage bucket 'project-files'.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function acceptQuote() {
    setAccepted(true);
    await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: currentUserId,
      message_type: "system",
      content: "Khách hàng đã đồng ý báo giá. 🎉",
    });
  }

  const hasQuote = messages.some((m) => m.message_type === "quote");

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-semibold text-slate-900">{project.title}</h1>
            <p className="text-xs text-slate-500">
              {project.industry || "Phòng trao đổi dự án"}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Messages */}
      <div className="scroll-thin flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-5 sm:px-6">
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-red-500">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
            <MessageSquareDashed className="h-10 w-10" />
            <p className="mt-2 text-sm">
              Chưa có tin nhắn. Hãy bắt đầu trao đổi thêm về bài toán của bạn.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={{ ...m, sender: m.sender_id ? senders[m.sender_id] : null }}
              isOwn={m.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Accept quote bar (client only) */}
      {!isAdmin && hasQuote && !accepted && (
        <div className="border-t border-slate-200 bg-violet-50 px-4 py-3 sm:px-6">
          <button
            onClick={acceptQuote}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 font-semibold text-white hover:bg-violet-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Tôi đồng ý báo giá
          </button>
        </div>
      )}
      {!isAdmin && accepted && (
        <div className="border-t border-slate-200 bg-emerald-50 px-4 py-2.5 text-center text-sm font-medium text-emerald-700">
          Bạn đã đồng ý báo giá. Cảm ơn bạn!
        </div>
      )}

      {/* Composer */}
      {error && messages.length > 0 && (
        <div className="bg-red-50 px-4 py-1.5 text-center text-xs text-red-600">
          {error}
        </div>
      )}
      <div className="border-t border-slate-200 bg-white px-3 py-3 sm:px-4">
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Đính kèm file"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Paperclip className="h-5 w-5" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFile}
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendText();
              }
            }}
            rows={1}
            placeholder="Nhập tin nhắn..."
            className="max-h-32 flex-1 resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            onClick={sendText}
            disabled={sending || !text.trim()}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40"
            aria-label="Gửi"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        {isAdmin && (
          <p className="mt-1.5 px-1 text-xs text-slate-400">
            Gửi báo giá ở trang quản trị. Báo giá sẽ hiện dưới dạng thẻ trong
            phòng chat này.
          </p>
        )}
        {!isAdmin && hasQuote && (
          <p className="mt-1.5 px-1 text-xs text-slate-400">
            Báo giá hiện tại: {formatVND(project.quoted_price)}
          </p>
        )}
      </div>
    </div>
  );
}
