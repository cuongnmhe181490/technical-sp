"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Tôi không biết công nghệ thì có thuê được không?",
    a: "Được. Bạn chỉ cần mô tả việc đang làm tay mỗi ngày. Việc chọn công nghệ phù hợp và dựng tool là phần của tôi. Bàn giao kèm hướng dẫn dùng dễ hiểu.",
  },
  {
    q: "Tôi chỉ có ý tưởng mơ hồ thì sao?",
    a: "Không sao. Cứ gửi ý tưởng ở mức bạn đang nghĩ. Tôi sẽ hỏi thêm vài câu để làm rõ và đề xuất phiên bản nhỏ nhất chạy được để bắt đầu.",
  },
  {
    q: "Bao lâu có bản đầu tiên?",
    a: "Tùy phạm vi. Một landing page có thể 1–3 ngày. Tool quản lý dữ liệu thường 3–7 ngày. Automation phức tạp hơn có thể 7–14 ngày trở lên. Chúng ta thống nhất mốc thời gian trước khi bắt đầu.",
  },
  {
    q: "Giá tính thế nào?",
    a: "Giá theo phạm vi công việc, không theo giờ mơ hồ. Sau khi phân tích bài toán, tôi gửi báo giá rõ ràng: làm gì, không làm gì, bao nhiêu. Bạn đồng ý rồi mới bắt đầu.",
  },
  {
    q: "Có bảo trì không?",
    a: "Có. Sau bàn giao vẫn hỗ trợ sửa lỗi trong thời gian thỏa thuận. Nếu cần nâng cấp hay thêm tính năng về sau, mình báo giá riêng theo từng phần.",
  },
  {
    q: "Có làm app mobile không?",
    a: "Phần lớn bài toán nhỏ giải quyết tốt bằng web chạy được trên điện thoại (responsive). Nếu thật sự cần app store, mình sẽ trao đổi cụ thể về phạm vi và chi phí.",
  },
  {
    q: "Có tích hợp Zalo / Shopee / TikTok Shop không?",
    a: "Tùy nền tảng cho phép tới đâu. Có cái nối được qua API, có cái chỉ nhập/xuất file. Tôi sẽ nói rõ cái gì khả thi, cái gì không, trước khi bạn quyết định.",
  },
  {
    q: "Dữ liệu của tôi có an toàn không?",
    a: "Dữ liệu lưu trên hạ tầng có kiểm soát truy cập. Mỗi khách chỉ xem được dữ liệu và phòng chat của mình. Tôi không chia sẻ dữ liệu của bạn cho bên khác.",
  },
  {
    q: "Có cam kết tăng doanh thu không?",
    a: "Không. Tôi không hứa tăng doanh thu vì điều đó phụ thuộc nhiều yếu tố ngoài công cụ. Cái tôi tập trung là giúp bạn bớt việc tay, gọn quy trình và làm việc nhanh hơn.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium text-slate-900">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <p className="pb-5 text-sm leading-relaxed text-slate-600">{a}</p>}
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-3 text-slate-600">
            Chưa thấy câu trả lời? Cứ gửi bài toán, tôi trả lời trực tiếp trong
            phòng chat.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6">
          {faqs.map((f) => (
            <Item key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
