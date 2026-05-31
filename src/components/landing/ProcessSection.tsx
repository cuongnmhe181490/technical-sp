const steps = [
  {
    n: "1",
    title: "Bạn gửi bài toán",
    desc: "Điền form mô tả việc đang làm tay. Không cần thuật ngữ kỹ thuật.",
  },
  {
    n: "2",
    title: "Tôi phân tích vấn đề",
    desc: "Tìm đúng điểm tốn thời gian và đâu là chỗ tự động hóa có giá trị.",
  },
  {
    n: "3",
    title: "Đề xuất giải pháp nhỏ nhất chạy được",
    desc: "Bắt đầu gọn để bạn thấy kết quả nhanh, tránh làm to rồi bỏ.",
  },
  {
    n: "4",
    title: "Báo giá & thống nhất phạm vi",
    desc: "Rõ ràng làm gì, không làm gì, giá bao nhiêu trước khi bắt tay.",
  },
  {
    n: "5",
    title: "Build bản đầu tiên",
    desc: "Tôi dựng phiên bản chạy được để bạn dùng thử trên dữ liệu thật.",
  },
  {
    n: "6",
    title: "Test, sửa, bàn giao",
    desc: "Chỉnh theo phản hồi của bạn rồi bàn giao kèm hướng dẫn dùng.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Quy trình làm việc</h2>
          <p className="mt-3 text-slate-300">
            Minh bạch từng bước. Bạn luôn biết đang ở đâu trong quá trình.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 font-bold">
                {s.n}
              </span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
