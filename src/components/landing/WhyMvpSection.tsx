import { Clock, Coins, Repeat, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: Clock,
    title: "Thấy kết quả nhanh",
    desc: "Có bản chạy được trong vài ngày thay vì chờ hàng tháng.",
  },
  {
    icon: Coins,
    title: "Tiết kiệm chi phí",
    desc: "Chỉ trả cho phần thật sự cần, tránh đầu tư lớn cho thứ chưa chắc dùng.",
  },
  {
    icon: Repeat,
    title: "Dễ điều chỉnh",
    desc: "Dùng thử trên việc thật rồi mới mở rộng theo đúng nhu cầu.",
  },
  {
    icon: ShieldCheck,
    title: "Giảm rủi ro",
    desc: "Kiểm chứng ý tưởng trước khi bỏ nhiều tiền và thời gian.",
  },
];

export function WhyMvpSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Vì sao nên làm MVP nhỏ trước?
            </h2>
            <p className="mt-4 text-slate-600">
              MVP là phiên bản nhỏ nhất giải quyết được vấn đề chính. Làm nhỏ
              trước giúp bạn dùng thử nhanh, biết cái gì thật sự hữu ích, rồi mới
              đầu tư mở rộng đúng chỗ. Tránh trường hợp làm to, tốn kém rồi không
              dùng tới.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <r.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-semibold text-slate-900">{r.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
