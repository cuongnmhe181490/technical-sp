import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const problems = [
  "Đơn hàng và khách đang nằm rải rác trong Excel, Zalo, tin nhắn.",
  "Mỗi ngày mất hàng giờ copy-paste, nhập liệu, trả lời câu hỏi giống nhau.",
  "Muốn có form/trang web để khách tự điền thay vì hỏi tay từng người.",
  "Có ý tưởng app/tool nhưng không biết nên bắt đầu từ đâu.",
];

export function StartFromProblem() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Không biết cần tool gì? Hãy bắt đầu từ vấn đề.
            </h2>
            <p className="mt-4 text-slate-600">
              Bạn không cần biết “nên làm web hay app hay automation”. Bạn chỉ
              cần mô tả việc đang làm tay mỗi ngày. Phần chọn giải pháp đúng là
              việc của tôi.
            </p>
            <div className="mt-6">
              <ButtonLink href="/submit" size="lg">
                Mô tả vấn đề của bạn
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>

          <ul className="space-y-3">
            {problems.map((p) => (
              <li
                key={p}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                  ?
                </span>
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
