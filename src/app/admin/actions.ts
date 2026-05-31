"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProjectStatus } from "@/lib/types";

// Guard: throw unless the caller is an admin.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") throw new Error("Không có quyền truy cập.");
  return user;
}

export async function updateStatus(projectId: string, status: ProjectStatus) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function saveInternalNote(projectId: string, note: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ internal_note: note })
    .eq("id", projectId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function saveQuote(projectId: string, amount: number) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ quoted_price: amount })
    .eq("id", projectId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

// Save the quote AND drop a quote message into the project's room.
export async function sendQuoteToRoom(
  projectId: string,
  amount: number,
  note: string
) {
  const user = await requireAdmin();
  const supabase = await createClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("project_id", projectId)
    .maybeSingle();

  if (!room) return { error: "Không tìm thấy phòng chat của dự án." };

  await supabase
    .from("projects")
    .update({ quoted_price: amount, status: "quoted" })
    .eq("id", projectId);

  const { error } = await supabase.from("messages").insert({
    room_id: room.id,
    sender_id: user.id,
    message_type: "quote",
    quote_amount: amount,
    content: note || "Đây là báo giá dự kiến cho bài toán của bạn.",
  });

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

// Invite a collaborator (by email) into the project's room.
export async function addCollaborator(projectId: string, email: string) {
  await requireAdmin();
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email.trim())
    .maybeSingle();

  if (!profile) {
    return {
      error:
        "Chưa có tài khoản với email này. Nhờ họ đăng ký tại /login trước.",
    };
  }

  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("project_id", projectId)
    .maybeSingle();

  if (!room) return { error: "Không tìm thấy phòng chat." };

  const { error } = await admin
    .from("room_members")
    .upsert(
      { room_id: room.id, user_id: profile.id, role: "collaborator" },
      { onConflict: "room_id,user_id" }
    );

  if (error) return { error: error.message };

  await admin.from("messages").insert({
    room_id: room.id,
    sender_id: null,
    message_type: "system",
    content: `Một cộng tác viên (${email.trim()}) đã được thêm vào phòng.`,
  });

  revalidatePath("/admin");
  return { ok: true };
}
