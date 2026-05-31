import { Suspense } from "react";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Đăng nhập — AutoWeb Studio",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 font-bold text-slate-900"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
            <Boxes className="h-5 w-5" />
          </span>
          AutoWeb Studio
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Đăng nhập</h1>
          <p className="mt-1 text-sm text-slate-500">
            Dành cho admin và cộng tác viên.
          </p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Bạn là khách hàng cần gửi bài toán?{" "}
          <Link href="/submit" className="font-medium text-brand-600 hover:underline">
            Gửi tại đây
          </Link>
        </p>
      </div>
    </main>
  );
}
