// Shared domain types. Kept hand-written & small for the MVP.

export type Role = "admin" | "client" | "collaborator";
export type RoomRole = "owner" | "admin" | "client" | "collaborator";
export type ProjectStatus =
  | "new"
  | "analyzing"
  | "quoted"
  | "building"
  | "done";
export type MessageType = "text" | "system" | "quote" | "file";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: Role;
  avatar_url: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string | null;
  title: string;
  business_name: string | null;
  industry: string | null;
  problem: string | null;
  current_process: string | null;
  desired_outcome: string | null;
  time_wasted: string | null;
  budget_range: string | null;
  urgency: string | null;
  status: ProjectStatus;
  quoted_price: number | null;
  internal_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  project_id: string;
  name: string;
  created_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string | null;
  content: string | null;
  message_type: MessageType;
  file_url: string | null;
  quote_amount: number | null;
  created_at: string;
  // Joined client-side for display
  sender?: Pick<Profile, "full_name" | "role" | "avatar_url"> | null;
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  role: RoomRole;
  created_at: string;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  new: "Mới gửi",
  analyzing: "Đang phân tích",
  quoted: "Đã báo giá",
  building: "Đang build",
  done: "Hoàn thành",
};

export const STATUS_ORDER: ProjectStatus[] = [
  "new",
  "analyzing",
  "quoted",
  "building",
  "done",
];
