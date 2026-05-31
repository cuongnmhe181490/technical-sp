import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SubmitProblemForm } from "@/components/SubmitProblemForm";

export const metadata = {
  title: "Gửi bài toán — AutoWeb Studio",
};

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Về trang chủ
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Gửi bài toán của bạn
          </h1>
          <p className="mt-2 text-slate-600">
            Mô tả việc bạn đang làm tay. Không cần thuật ngữ kỹ thuật. Sau khi
            gửi, hệ thống tạo một phòng chat riêng để chúng ta trao đổi và chốt
            phạm vi.
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
            <ShieldCheck className="h-4 w-4" />
            Thông tin của bạn được bảo mật và chỉ dùng để tư vấn cho bài toán này.
          </div>

          <div className="mt-8">
            <SubmitProblemForm />
          </div>
        </div>
      </div>
    </main>
  );
}
