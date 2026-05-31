import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { NewRoomToast } from "@/components/chat/NewRoomToast";
import type { Project } from "@/lib/types";

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { roomId } = await params;
  const { new: isNew } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/room/${roomId}`);
  }

  // RLS guarantees the user only gets the room if they are a member.
  const { data: room } = await supabase
    .from("rooms")
    .select("id, project_id, name")
    .eq("id", roomId)
    .maybeSingle();

  if (!room) notFound();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", room.project_id)
    .maybeSingle();

  if (!project) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 sm:px-6">
        <Link
          href={isAdmin ? "/admin" : "/"}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {isAdmin ? "Về trang quản trị" : "Về trang chủ"}
        </Link>
        <span className="text-xs text-slate-400">Phòng trao đổi</span>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col border-x border-slate-200 bg-white">
          <ChatRoom
            roomId={roomId}
            currentUserId={user.id}
            isAdmin={isAdmin}
            project={project as Project}
          />
        </div>
      </div>

      {isNew && <NewRoomToast />}
    </div>
  );
}
