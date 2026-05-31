import { redirect } from "next/navigation";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { LogoutButton } from "@/components/admin/LogoutButton";
import type { Project } from "@/lib/types";

export const metadata = {
  title: "Quản trị — AutoWeb Studio",
};

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-lg font-bold text-slate-900">
            Tài khoản chưa có quyền admin
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Tài khoản <strong>{profile?.email ?? user.email}</strong> chưa được
            cấp quyền. Chạy <code>supabase/make-admin.sql</code> với email này,
            rồi đăng nhập lại.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Về trang chủ
            </Link>
            <LogoutButton />
          </div>
        </div>
      </main>
    );
  }

  // Admin RLS lets us read all projects.
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  // Map project_id -> room_id for "open chat" links.
  const { data: rooms } = await supabase.from("rooms").select("id, project_id");
  const roomByProject: Record<string, string> = {};
  for (const r of rooms ?? []) roomByProject[r.project_id] = r.id;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              <Boxes className="h-4 w-4" />
            </span>
            AutoWeb Studio
            <span className="ml-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:inline">
              {profile.full_name || profile.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <AdminDashboard
          projects={(projects ?? []) as Project[]}
          roomByProject={roomByProject}
        />
      </main>
    </div>
  );
}
