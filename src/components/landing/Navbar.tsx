"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Boxes } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const links = [
  { href: "/#services", label: "Dịch vụ" },
  { href: "/#process", label: "Quy trình" },
  { href: "/#pricing", label: "Bảng giá" },
  { href: "/#examples", label: "Ví dụ" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
            <Boxes className="h-5 w-5" />
          </span>
          <span className="text-lg">AutoWeb Studio</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Đăng nhập
          </Link>
          <ButtonLink href="/submit" size="sm">
            Gửi bài toán
          </ButtonLink>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Mở menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Đăng nhập
            </Link>
            <ButtonLink href="/submit" className="mt-2 w-full">
              Gửi bài toán
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
