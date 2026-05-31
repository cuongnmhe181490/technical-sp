"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

const industries = [
  "Shop online / bán lẻ",
  "Shopee / TikTok Shop / Sàn TMĐT",
  "Spa / làm đẹp",
  "Phòng khám / y tế",
  "Trung tâm đào tạo / giáo dục",
  "Nhà hàng / quán ăn / cafe",
  "Freelancer / agency",
  "Studio / sáng tạo",
  "Khác",
];

const budgets = [
  "Chưa rõ, cần tư vấn",
  "Dưới 3 triệu",
  "3 – 10 triệu",
  "10 – 30 triệu",
  "Trên 30 triệu",
];

const urgencies = ["Bình thường", "Khá gấp", "Rất gấp"];

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
const label = "mb-1.5 block text-sm font-medium text-slate-700";

export function SubmitProblemForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Ensure there is a session. Guests get an anonymous user so RLS
      // can tie the room to a real auth.uid().
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        const { error: anonErr } = await supabase.auth.signInAnonymously();
        if (anonErr) {
          throw new Error(
            "Không khởi tạo được phiên. Vui lòng bật Anonymous Sign-in trong Supabase."
          );
        }
      }

      const form = e.currentTarget;
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gửi không thành công.");

      router.push(`/room/${json.roomId}?new=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="full_name">
            Họ tên <span className="text-red-500">*</span>
          </label>
          <input id="full_name" name="full_name" required className={field} placeholder="Nguyễn Văn A" />
        </div>
        <div>
          <label className={label} htmlFor="business_name">
            Tên doanh nghiệp / shop
          </label>
          <input id="business_name" name="business_name" className={field} placeholder="Shop ABC (nếu có)" />
        </div>
        <div>
          <label className={label} htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input id="email" name="email" type="email" required className={field} placeholder="ban@email.com" />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Số điện thoại / Zalo <span className="text-red-500">*</span>
          </label>
          <input id="phone" name="phone" required className={field} placeholder="09xx xxx xxx" />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="industry">
          Lĩnh vực
        </label>
        <select id="industry" name="industry" className={field} defaultValue="">
          <option value="" disabled>
            Chọn lĩnh vực gần nhất
          </option>
          {industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label} htmlFor="problem">
          Vấn đề hiện tại <span className="text-red-500">*</span>
        </label>
        <textarea
          id="problem"
          name="problem"
          required
          rows={4}
          className={field}
          placeholder="Mô tả việc bạn đang làm tay mỗi ngày và chỗ thấy mất thời gian nhất."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="current_process">
            Hiện đang xử lý bằng cách nào?
          </label>
          <textarea id="current_process" name="current_process" rows={3} className={field} placeholder="Ví dụ: ghi Excel, nhắn Zalo, sổ tay..." />
        </div>
        <div>
          <label className={label} htmlFor="desired_outcome">
            Muốn kết quả cuối cùng như thế nào?
          </label>
          <textarea id="desired_outcome" name="desired_outcome" rows={3} className={field} placeholder="Ví dụ: khách tự điền form, mình xem đơn ở một nơi..." />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="time_wasted">
            Mỗi tuần/tháng tốn bao nhiêu thời gian?
          </label>
          <input id="time_wasted" name="time_wasted" className={field} placeholder="Ví dụ: ~10 giờ/tuần" />
        </div>
        <div>
          <label className={label} htmlFor="budget_range">
            Ngân sách dự kiến
          </label>
          <select id="budget_range" name="budget_range" className={field} defaultValue="">
            <option value="" disabled>
              Chọn mức
            </option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="urgency">
            Mức độ gấp
          </label>
          <select id="urgency" name="urgency" className={field} defaultValue="Bình thường">
            {urgencies.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="reference_link">
          Link tham khảo (nếu có)
        </label>
        <input id="reference_link" name="reference_link" className={field} placeholder="Link Google Sheet, web mẫu, file Drive..." />
        <p className="mt-1 text-xs text-slate-500">
          Bạn có thể upload file trực tiếp trong phòng chat sau khi gửi.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang tạo phòng trao đổi...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Gửi bài toán & tạo phòng chat
          </>
        )}
      </Button>
    </form>
  );
}
