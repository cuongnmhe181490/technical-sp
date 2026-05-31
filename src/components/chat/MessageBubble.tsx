import { FileText, BadgeDollarSign } from "lucide-react";
import { cn, formatTime, formatVND, initials } from "@/lib/utils";
import type { Message } from "@/lib/types";

export function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  // System messages: centered pill.
  if (message.message_type === "system") {
    return (
      <div className="my-2 flex justify-center">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
          {message.content}
        </span>
      </div>
    );
  }

  const senderName = message.sender?.full_name || "Người dùng";
  const isAdmin = message.sender?.role === "admin";

  return (
    <div className={cn("flex gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
      {!isOwn && (
        <div className="mt-auto grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
          {initials(senderName)}
        </div>
      )}

      <div className={cn("max-w-[78%]", isOwn ? "items-end" : "items-start")}>
        {!isOwn && (
          <div className="mb-1 flex items-center gap-2 px-1">
            <span className="text-xs font-medium text-slate-700">
              {senderName}
            </span>
            {isAdmin && (
              <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">
                Admin
              </span>
            )}
          </div>
        )}

        {/* Quote message */}
        {message.message_type === "quote" ? (
          <div
            className={cn(
              "rounded-2xl border p-4",
              isOwn
                ? "border-brand-200 bg-brand-50"
                : "border-violet-200 bg-violet-50"
            )}
          >
            <div className="flex items-center gap-2 text-violet-700">
              <BadgeDollarSign className="h-4 w-4" />
              <span className="text-sm font-semibold">Báo giá</span>
            </div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">
              {formatVND(message.quote_amount)}
            </div>
            {message.content && (
              <p className="mt-1 text-sm text-slate-600">{message.content}</p>
            )}
          </div>
        ) : message.message_type === "file" ? (
          <a
            href={message.file_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors hover:bg-slate-50",
              isOwn ? "border-brand-200 bg-brand-50" : "border-slate-200 bg-white"
            )}
          >
            <FileText className="h-5 w-5 text-brand-600" />
            <span className="text-sm font-medium text-slate-800">
              {message.content || "Tập tin đính kèm"}
            </span>
          </a>
        ) : (
          <div
            className={cn(
              "whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm",
              isOwn
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-800 ring-1 ring-slate-200"
            )}
          >
            {message.content}
          </div>
        )}

        <div
          className={cn(
            "mt-1 px-1 text-[11px] text-slate-400",
            isOwn ? "text-right" : "text-left"
          )}
        >
          {formatTime(message.created_at)}
        </div>
      </div>
    </div>
  );
}
