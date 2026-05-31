import { cn } from "@/lib/utils";
import { STATUS_LABELS, type ProjectStatus } from "@/lib/types";

const styles: Record<ProjectStatus, string> = {
  new: "bg-slate-100 text-slate-700 ring-slate-200",
  analyzing: "bg-amber-50 text-amber-700 ring-amber-200",
  quoted: "bg-violet-50 text-violet-700 ring-violet-200",
  building: "bg-blue-50 text-blue-700 ring-blue-200",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        styles[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
