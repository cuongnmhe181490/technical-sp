import {
  Globe,
  Megaphone,
  ClipboardList,
  LayoutDashboard,
  Users,
  Wrench,
  Workflow,
  Bot,
  Rocket,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Website giới thiệu doanh nghiệp",
    desc: "Trang web gọn gàng, đáng tin để khách tìm thấy và liên hệ bạn.",
  },
  {
    icon: Megaphone,
    title: "Landing page bán hàng",
    desc: "Trang đích tập trung một sản phẩm/dịch vụ, có nút mua/đăng ký rõ ràng.",
  },
  {
    icon: ClipboardList,
    title: "Form nhận lead / báo giá",
    desc: "Thu thập thông tin khách tự động thay cho nhắn tin thủ công.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard quản lý dữ liệu",
    desc: "Xem số liệu đơn hàng, khách, doanh thu ở một nơi gọn gàng.",
  },
  {
    icon: Users,
    title: "Mini CRM quản lý khách",
    desc: "Lưu khách, lịch sử trao đổi, trạng thái chăm sóc — hết phải nhớ trong đầu.",
  },
  {
    icon: Wrench,
    title: "Tool nội bộ cho nhân viên",
    desc: "Công cụ riêng cho việc lặp lại hằng ngày của team bạn.",
  },
  {
    icon: Workflow,
    title: "Automation Sheet / Notion / Airtable",
    desc: "Nối các công cụ đang dùng để dữ liệu tự chảy, bớt copy-paste.",
  },
  {
    icon: Bot,
    title: "Chatbot tư vấn khách hàng",
    desc: "Trả lời câu hỏi thường gặp, lọc khách tiềm năng tự động.",
  },
  {
    icon: Rocket,
    title: "MVP cho ý tưởng app / SaaS",
    desc: "Bản nhỏ nhất chạy được để bạn thử nghiệm ý tưởng với người dùng thật.",
  },
];

export function ServiceCards() {
  return (
    <section id="services" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Tôi giúp bạn build gì?
          </h2>
          <p className="mt-3 text-slate-600">
            Không bán “gói công nghệ”. Tôi build đúng thứ giải quyết được việc
            bạn đang làm tay mỗi ngày.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
