"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { MessageSquare, Save, Send, UserPlus, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatVND } from "@/lib/utils";
import {
  STATUS_LABELS,
  STATUS_ORDER,
  type Project,
  type ProjectStatus,
} from "@/lib/types";
import {
  updateStatus,
  saveInternalNote,
  sendQuoteToRoom,
  addCollaborator,
} from "@/app/admin/actions";

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="py-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-sm text-slate-800">
        {value || "—"}
      </dd>
    </div>
  );
}

export function AdminProjectDetail({
  project,
  roomId,
}: {
  project: Project;
  roomId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState(project.internal_note ?? "");
  const [quote, setQuote] = useState<string>(
    project.quoted_price ? String(project.quoted_price) : ""
  );
  const [quoteNote, setQuoteNote] = useState("");
  const [collabEmail, setCollabEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  // Reset local state when switching projects.
  useEffect(() => {
    setNote(project.internal_note ?? "");
    setQuote(project.quoted_price ? String(project.quoted_price) : "");
    setQuoteNote("");
    setCollabEmail("");
    setMsg(null);
  }, [project.id, project.internal_note, project.quoted_price]);

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{project.title}</h2>
          <p className="text-sm text-slate-500">
            {project.business_name || "Cá nhân"} ·{" "}
            {new Date(project.created_at).toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
          {roomId && (
            <Link
              href={`/room/${roomId}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              <MessageSquare className="h-4 w-4" />
              Mở phòng chat
            </Link>
          )}
        </div>
      </div>

      {msg && (
        <div className="mx-5 mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {msg}
        </div>
      )}

      <div className="grid gap-6 p-5 lg:grid-cols-2">
        {/* Lead details */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Thông tin bài toán
          </h3>
          <dl className="divide-y divide-slate-100">
            <Row label="Vấn đề hiện tại" value={project.problem} />
            <Row label="Đang xử lý bằng cách nào" value={project.current_process} />
            <Row label="Kết quả mong muốn" value={project.desired_outcome} />
            <Row label="Lĩnh vực" value={project.industry} />
            <Row label="Thời gian tốn" value={project.time_wasted} />
            <Row label="Ngân sách" value={project.budget_range} />
            <Row label="Mức độ gấp" value={project.urgency} />
          </dl>
        </div>

        {/* Admin controls */}
        <div className="space-y-6">
          {/* Status */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              Cập nhật trạng thái
            </h3>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const r = await updateStatus(project.id, s as ProjectStatus);
                      if (!r?.error) flash(`Đã chuyển trạng thái: ${STATUS_LABELS[s]}`);
                    })
                  }
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    project.status === s
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              Báo giá
            </h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Số tiền (VND)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <input
              value={quoteNote}
              onChange={(e) => setQuoteNote(e.target.value)}
              placeholder="Ghi chú gửi kèm báo giá (tùy chọn)"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <button
              disabled={pending || !quote}
              onClick={() =>
                startTransition(async () => {
                  const r = await sendQuoteToRoom(
                    project.id,
                    Number(quote),
                    quoteNote
                  );
                  if (r?.error) flash(r.error);
                  else flash("Đã gửi báo giá vào phòng chat.");
                })
              }
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Gửi báo giá vào phòng chat
            </button>
            {project.quoted_price ? (
              <p className="mt-1.5 text-xs text-slate-500">
                Báo giá hiện tại: {formatVND(project.quoted_price)}
              </p>
            ) : null}
          </div>

          {/* Internal note */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              Ghi chú nội bộ
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Chỉ admin/cộng tác viên thấy ghi chú này."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <button
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const r = await saveInternalNote(project.id, note);
                  if (!r?.error) flash("Đã lưu ghi chú.");
                })
              }
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Lưu ghi chú
            </button>
          </div>

          {/* Collaborator */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              Thêm cộng tác viên vào phòng
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={collabEmail}
                onChange={(e) => setCollabEmail(e.target.value)}
                placeholder="email@congtacvien.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              <button
                disabled={pending || !collabEmail}
                onClick={() =>
                  startTransition(async () => {
                    const r = await addCollaborator(project.id, collabEmail);
                    if (r?.error) flash(r.error);
                    else {
                      flash("Đã thêm cộng tác viên.");
                      setCollabEmail("");
                    }
                  })
                }
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Cộng tác viên cần đã có tài khoản (đăng ký tại /login).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
