"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

// Confirmation banner shown right after a customer submits a problem.
export function NewRoomToast() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="animate-fade-in flex max-w-md items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-lg">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">
            Đã tạo phòng trao đổi
          </p>
          <p className="mt-0.5 text-sm text-slate-600">
            Bạn có thể chat thêm thông tin tại đây. Chúng tôi sẽ phản hồi sớm.
          </p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
