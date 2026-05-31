import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Basic server-side validation. Keep messages friendly & in Vietnamese.
function validate(body: Record<string, unknown>) {
  const errors: string[] = [];
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  if (str(body.full_name).length < 2) errors.push("Vui lòng nhập họ tên.");
  const email = str(body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Email chưa hợp lệ.");
  if (str(body.phone).length < 6)
    errors.push("Vui lòng nhập số điện thoại/Zalo.");
  if (str(body.problem).length < 10)
    errors.push("Mô tả vấn đề quá ngắn, vui lòng viết rõ hơn.");

  return errors;
}

export async function POST(request: Request) {
  // Rate limit by IP: 5 submissions / minute.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limited = rateLimit(`submit:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Bạn gửi hơi nhanh. Vui lòng thử lại sau ít phút." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  // Identify the (anonymous) signed-in user from the cookie session.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Phiên đăng nhập chưa sẵn sàng. Vui lòng tải lại trang." },
      { status: 401 }
    );
  }

  const admin = createAdminClient();
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : null);

  // Keep the profile up to date with the contact details.
  await admin
    .from("profiles")
    .update({ full_name: s(body.full_name), email: s(body.email) })
    .eq("id", user.id);

  const title =
    s(body.business_name) || `Bài toán của ${s(body.full_name) ?? "khách"}`;

  // Fold the contact + reference link into the problem text so admins
  // see everything in one place (no schema churn for the MVP).
  const refLink = s(body.reference_link);
  const phone = s(body.phone);
  const problemParts = [
    s(body.problem),
    phone ? `\n\n— Liên hệ: ${phone}` : "",
    refLink ? `\n— Link tham khảo: ${refLink}` : "",
  ].filter(Boolean);
  const problem = problemParts.join("");

  // 1) Project
  const { data: project, error: projectErr } = await admin
    .from("projects")
    .insert({
      client_id: user.id,
      title,
      business_name: s(body.business_name),
      industry: s(body.industry),
      problem,
      current_process: s(body.current_process),
      desired_outcome: s(body.desired_outcome),
      time_wasted: s(body.time_wasted),
      budget_range: s(body.budget_range),
      urgency: s(body.urgency),
      status: "new",
    })
    .select()
    .single();

  if (projectErr || !project) {
    return NextResponse.json(
      { error: "Không tạo được dự án. Vui lòng thử lại." },
      { status: 500 }
    );
  }

  // 2) Room
  const { data: room, error: roomErr } = await admin
    .from("rooms")
    .insert({ project_id: project.id, name: title })
    .select()
    .single();

  if (roomErr || !room) {
    return NextResponse.json(
      { error: "Không tạo được phòng trao đổi. Vui lòng thử lại." },
      { status: 500 }
    );
  }

  // 3) Membership: the client is the owner of this room.
  await admin.from("room_members").insert({
    room_id: room.id,
    user_id: user.id,
    role: "owner",
  });

  // 3b) Add every admin to the room so they see the lead immediately.
  const { data: admins } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "admin");

  if (admins?.length) {
    await admin.from("room_members").insert(
      admins.map((a) => ({
        room_id: room.id,
        user_id: a.id,
        role: "admin" as const,
      }))
    );
  }

  // 4) System welcome message.
  await admin.from("messages").insert({
    room_id: room.id,
    sender_id: null,
    message_type: "system",
    content:
      "Phòng trao đổi đã được tạo. Bạn có thể bổ sung thêm thông tin tại đây. Chúng tôi sẽ phản hồi sớm.",
  });

  return NextResponse.json({ roomId: room.id, projectId: project.id });
}
