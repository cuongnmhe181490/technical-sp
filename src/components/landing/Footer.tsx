import Link from "next/link";
import { Boxes } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            <Boxes className="h-4 w-4" />
          </span>
          AutoWeb Studio
        </div>
        <p className="text-sm text-slate-500">
          Biến bài toán thủ công thành web, tool và automation chạy được.
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <Link href="/submit" className="hover:text-slate-900">
            Gửi bài toán
          </Link>
          <Link href="/login" className="hover:text-slate-900">
            Đăng nhập
          </Link>
        </div>
      </div>
    </footer>
  );
}
