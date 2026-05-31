import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-14 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10" />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            Gửi bài toán để nhận tư vấn
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-brand-50">
            Mô tả việc bạn đang làm tay. Tôi sẽ phân tích miễn phí và tạo một
            phòng chat riêng để chúng ta trao đổi và chốt phạm vi.
          </p>
          <div className="relative mt-8 flex justify-center">
            <ButtonLink
              href="/submit"
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50"
            >
              Bắt đầu ngay
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
