import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
      <div>
        <p className="text-5xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-3 text-xl font-bold text-slate-900">
          Không tìm thấy trang
        </h1>
        <p className="mt-2 text-slate-500">
          Trang bạn tìm không tồn tại hoặc bạn không có quyền truy cập.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
