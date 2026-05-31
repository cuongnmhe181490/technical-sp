import { ArrowRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brand-100 blur-3xl opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Dành cho cá nhân & doanh nghiệp nhỏ
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Biến bài toán thủ công thành{" "}
            <span className="text-brand-600">web, tool và automation</span> chạy được.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Bạn đang quản lý khách, đơn hàng, dữ liệu hay quy trình bằng
            Excel/Zalo quá rối? Hãy gửi bài toán, tôi sẽ phân tích và đề xuất một
            web/tool nhỏ để giải quyết nhanh.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/submit" size="lg">
              Gửi bài toán để nhận tư vấn
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/#examples" size="lg" variant="outline">
              Xem ví dụ tool có thể làm
            </ButtonLink>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Miễn phí phân tích bài toán · Không cần biết công nghệ · Trả lời trong 24h
          </p>
        </div>

        {/* trust row */}
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Bắt đầu từ", "vấn đề thật"],
            ["MVP đầu tiên", "1–3 ngày"],
            ["Phạm vi rõ", "trước khi build"],
            ["Trao đổi", "qua phòng chat riêng"],
          ].map(([top, bottom]) => (
            <div
              key={bottom}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center"
            >
              <div className="text-xs text-slate-500">{top}</div>
              <div className="mt-1 font-semibold text-slate-900">{bottom}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
