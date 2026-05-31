import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const plans = [
  {
    name: "Quick Landing",
    price: "từ 399k",
    time: "1–3 ngày",
    desc: "Phù hợp cá nhân / shop / dịch vụ nhỏ.",
    features: [
      "Landing page 1 trang",
      "Form liên hệ / nhận lead",
      "Responsive mobile",
      "Tối ưu tốc độ tải cơ bản",
    ],
    highlight: false,
  },
  {
    name: "Business Tool",
    price: "báo theo bài toán",
    time: "3–7 ngày",
    desc: "Doanh nghiệp nhỏ đang xử lý quy trình thủ công.",
    features: [
      "Dashboard quản lý dữ liệu",
      "Form nhập liệu / quản lý đơn",
      "Phân quyền cơ bản",
      "Đăng nhập tài khoản",
    ],
    highlight: true,
  },
  {
    name: "Custom Automation",
    price: "báo theo phạm vi",
    time: "7–14 ngày+",
    desc: "Quy trình phức tạp hơn, cần nối nhiều công cụ.",
    features: [
      "Automation nhiều bước",
      "AI workflow khi phù hợp",
      "Tích hợp API nếu khả thi",
      "Tài liệu bàn giao",
    ],
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Gói dịch vụ
          </h2>
          <p className="mt-3 text-slate-600">
            Giá phụ thuộc vào phạm vi thực tế. Dưới đây là điểm khởi đầu để bạn
            hình dung. Gửi bài toán để nhận báo giá cụ thể.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl border p-7 ${
                p.highlight
                  ? "border-brand-600 bg-white shadow-lg ring-1 ring-brand-600"
                  : "border-slate-200 bg-white"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Phổ biến nhất
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{p.desc}</p>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-slate-900">
                  {p.price}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Thời gian: {p.time}
              </p>

              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {f}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/submit"
                className="mt-7 w-full"
                variant={p.highlight ? "primary" : "outline"}
              >
                Gửi bài toán
              </ButtonLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
