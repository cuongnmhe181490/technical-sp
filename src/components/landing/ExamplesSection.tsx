const examples = [
  {
    tag: "Shop online",
    problem: "Đơn hàng từ Shopee, TikTok, Facebook gom tay vào một file Excel.",
    solution:
      "Một dashboard gom đơn về một nơi, lọc theo kênh, trạng thái giao, tổng doanh thu theo ngày.",
  },
  {
    tag: "Spa / phòng khám",
    problem: "Đặt lịch qua Zalo, hay trùng giờ và quên nhắc khách.",
    solution:
      "Trang đặt lịch online + lịch xem theo ngày + nhắc lịch tự động cho khách.",
  },
  {
    tag: "Trung tâm đào tạo",
    problem: "Quản lý học viên, học phí, điểm danh bằng nhiều sheet rời.",
    solution:
      "Mini CRM học viên: hồ sơ, lớp, trạng thái học phí, điểm danh ở một chỗ.",
  },
  {
    tag: "Freelancer / agency",
    problem: "Khách hỏi báo giá qua nhiều kênh, khó theo dõi đã trả lời ai.",
    solution:
      "Form nhận yêu cầu + bảng quản lý lead theo trạng thái + phòng chat riêng từng khách.",
  },
  {
    tag: "Nhà hàng / quán",
    problem: "Nhận đặt bàn và đơn ship qua điện thoại, dễ sót.",
    solution:
      "Trang đặt bàn/đặt món đơn giản, thông báo về cho nhân viên xử lý ngay.",
  },
  {
    tag: "Ý tưởng SaaS",
    problem: "Có ý tưởng tool nhưng chưa biết người dùng có cần không.",
    solution:
      "MVP nhỏ chạy được để thử với người dùng thật trước khi đầu tư lớn.",
  },
];

export function ExamplesSection() {
  return (
    <section id="examples" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Ví dụ bài toán có thể giải quyết
          </h2>
          <p className="mt-3 text-slate-600">
            Đây là cách một vấn đề thủ công biến thành tool chạy được. Bài toán
            của bạn có thể khác — cứ gửi, tôi sẽ phân tích.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {examples.map((e) => (
            <div
              key={e.tag}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {e.tag}
              </span>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Vấn đề
                </p>
                <p className="mt-1 text-sm text-slate-700">{e.problem}</p>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                  Giải pháp
                </p>
                <p className="mt-1 text-sm text-slate-700">{e.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
