"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { AdminProjectList } from "@/components/admin/AdminProjectList";
import { AdminProjectDetail } from "@/components/admin/AdminProjectDetail";
import {
  STATUS_LABELS,
  STATUS_ORDER,
  type Project,
  type ProjectStatus,
} from "@/lib/types";

type Filter = "all" | ProjectStatus;

export function AdminDashboard({
  projects,
  roomByProject,
}: {
  projects: Project[];
  roomByProject: Record<string, string>;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    projects[0]?.id ?? null
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.status === filter),
    [projects, filter]
  );

  const selected =
    projects.find((p) => p.id === selectedId) ?? filtered[0] ?? null;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const s of STATUS_ORDER) c[s] = 0;
    for (const p of projects) c[p.status] = (c[p.status] ?? 0) + 1;
    return c;
  }, [projects]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead & dự án</h1>
          <p className="text-sm text-slate-500">
            {projects.length} bài toán đã nhận
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip
          active={filter === "all"}
          label={`Tất cả (${counts.all})`}
          onClick={() => setFilter("all")}
        />
        {STATUS_ORDER.map((s) => (
          <FilterChip
            key={s}
            active={filter === s}
            label={`${STATUS_LABELS[s]} (${counts[s] ?? 0})`}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <Inbox className="h-10 w-10 text-slate-300" />
          <p className="mt-3 font-medium text-slate-600">Chưa có lead nào</p>
          <p className="text-sm text-slate-400">
            Lead sẽ xuất hiện ở đây khi khách gửi bài toán qua trang /submit.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <div className="lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-1 scroll-thin">
            <AdminProjectList
              projects={filtered}
              selectedId={selected?.id ?? null}
              onSelect={(p) => setSelectedId(p.id)}
            />
          </div>
          <div>
            {selected ? (
              <AdminProjectDetail
                key={selected.id}
                project={selected}
                roomId={roomByProject[selected.id]}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                Chọn một lead để xem chi tiết.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-brand-600 text-white"
          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}
