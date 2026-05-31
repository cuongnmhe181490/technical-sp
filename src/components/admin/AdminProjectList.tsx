"use client";

import { cn, formatVND } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import type { Project } from "@/lib/types";

export function AdminProjectList({
  projects,
  selectedId,
  onSelect,
}: {
  projects: Project[];
  selectedId: string | null;
  onSelect: (p: Project) => void;
}) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Chưa có lead nào khớp bộ lọc.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {projects.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p)}
          className={cn(
            "w-full rounded-2xl border bg-white p-4 text-left transition-colors",
            selectedId === p.id
              ? "border-brand-500 ring-1 ring-brand-500"
              : "border-slate-200 hover:border-slate-300"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{p.title}</p>
              <p className="truncate text-xs text-slate-500">
                {p.industry || "—"}
              </p>
            </div>
            <StatusBadge status={p.status} />
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {p.problem || "Chưa có mô tả."}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>{new Date(p.created_at).toLocaleDateString("vi-VN")}</span>
            {p.quoted_price ? (
              <span className="font-medium text-violet-600">
                {formatVND(p.quoted_price)}
              </span>
            ) : (
              <span>{p.budget_range || ""}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
