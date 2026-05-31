# AutoWeb Studio

Mini-SaaS cho dịch vụ triển khai web, tool, dashboard, automation và AI-assisted
development. Không chỉ là landing page — khách gửi bài toán, hệ thống tạo
**Project Room** chat realtime giữa khách, admin và cộng tác viên.

**Tagline:** Biến bài toán thủ công thành web, tool và automation chạy được.

## Tech stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** + lucide-react icons
- **Supabase**: Postgres + Auth + Realtime + Storage
- **Vercel** (deploy)

## Cấu trúc thư mục

```
src/
├─ app/
│  ├─ page.tsx                 # Trang chủ (landing)
│  ├─ submit/                  # Form gửi bài toán
│  ├─ room/[roomId]/           # Phòng chat realtime
│  ├─ login/                   # Đăng nhập (admin/cộng tác viên)
│  ├─ admin/                   # Dashboard quản trị + server actions
│  └─ api/submit/route.ts      # Tạo project + room + membership
├─ components/
│  ├─ landing/                 # Navbar, Hero, ServiceCards, Pricing, FAQ...
│  ├─ chat/                    # ChatRoom, MessageBubble
│  ├─ admin/                   # AdminDashboard, ProjectList, ProjectDetail
│  ├─ SubmitProblemForm.tsx
│  ├─ LoginForm.tsx
│  └─ StatusBadge.tsx
├─ lib/
│  ├─ supabase/{client,server,admin}.ts
│  ├─ types.ts  utils.ts  rate-limit.ts
└─ middleware.ts               # Refresh phiên Supabase
supabase/
├─ schema.sql                  # Bảng, trigger, realtime
├─ policies.sql                # RLS policies + storage bucket
└─ make-admin.sql              # Cấp quyền admin
```

---

## 1. Cài đặt Supabase

### 1.1 Tạo project

1. Vào [supabase.com](https://supabase.com) → **New project**.
2. Lưu lại mật khẩu database.

### 1.2 Chạy SQL

Vào **SQL Editor** và chạy theo đúng thứ tự:

1. `supabase/schema.sql` — tạo bảng, trigger, bật realtime cho `messages`.
2. `supabase/policies.sql` — bật Row Level Security + tạo storage bucket.

### 1.3 Bật Anonymous Sign-in (quan trọng)

Khách gửi bài toán không cần đăng ký. Họ được cấp một phiên **ẩn danh** để
RLS gắn phòng chat với `auth.uid()` thật.

- Vào **Authentication → Sign In / Providers → Anonymous Sign-ins** → bật **ON**.

> Nếu không bật, form `/submit` sẽ báo lỗi khởi tạo phiên.

### 1.4 Lấy API keys

**Project Settings → API**:

- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ **chỉ dùng ở server**, không bao giờ để lộ ra client)

---

## 2. Cấu hình môi trường

Copy file mẫu và điền key:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 3. Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000

---

## 4. Tạo tài khoản admin

1. Vào `/login` → **Tạo tài khoản** với email + mật khẩu của bạn.
   - Nếu Supabase bật xác minh email, kiểm tra hộp thư để xác nhận.
2. Mở **SQL Editor**, sửa email trong `supabase/make-admin.sql` rồi chạy:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Đăng nhập lại → vào `/admin`.

### Thêm cộng tác viên

1. Cộng tác viên đăng ký tài khoản tại `/login`.
2. Trong `/admin`, mở một dự án → **Thêm cộng tác viên** bằng email của họ.
   Họ chỉ thấy đúng phòng được mời.

---

## 5. Luồng hoạt động

1. Khách vào `/submit`, điền form → tạo phiên ẩn danh.
2. `POST /api/submit` tạo `projects` + `rooms` + `room_members` (khách =
   owner, mọi admin được thêm sẵn) + một system message.
3. Khách được chuyển tới `/room/[roomId]` và chat realtime.
4. Admin xem lead ở `/admin`, lọc theo trạng thái, cập nhật trạng thái, ghi
   chú nội bộ, gửi báo giá (hiện dạng thẻ trong phòng chat).
5. Khách thấy báo giá và bấm **"Tôi đồng ý báo giá"**.

---

## 6. Bảo mật (RLS)

- Mọi bảng đều bật Row Level Security.
- Khách chỉ xem được room mình là thành viên (`is_room_member`).
- Admin xem được tất cả (`is_admin`).
- Cộng tác viên chỉ xem room được mời.
- Helper functions dùng `SECURITY DEFINER` để tránh đệ quy policy.
- `service_role` key chỉ dùng trong route handler / server action.
- Form được validate phía server + rate limit 5 request/phút theo IP.

---

## 7. Deploy lên Vercel

1. Push code lên GitHub.
2. Vào [vercel.com](https://vercel.com) → **Add New → Project** → import repo.
3. **Environment Variables** — thêm cả 3:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. **Deploy**.
5. Sau khi có domain, vào Supabase **Authentication → URL Configuration** →
   thêm domain Vercel vào **Site URL** và **Redirect URLs**.

```bash
# hoặc deploy bằng CLI
npm i -g vercel
vercel
vercel --prod
```

---

## 8. Mở rộng về sau (gợi ý)

- Typing indicator & presence: dùng Supabase Realtime Presence trên channel `room:{id}`.
- Email thông báo khi có lead mới (Resend / Supabase Edge Function).
- Rate limit phân tán bằng Upstash Redis thay cho bộ nhớ in-memory.
- Trang danh sách phòng cho khách đã đăng nhập lại.

> Lưu ý: rate limit hiện tại là in-memory, hoạt động tốt cho 1 instance.
> Khi scale nhiều instance trên Vercel, nên chuyển sang Upstash/Redis.
