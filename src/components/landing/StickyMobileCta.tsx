import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Fixed bottom CTA shown only on small screens.
export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <Link
        href="/submit"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white"
      >
        Gửi bài toán để nhận tư vấn
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
