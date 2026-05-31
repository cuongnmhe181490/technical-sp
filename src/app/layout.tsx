import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoWeb Studio — Biến bài toán thủ công thành web, tool & automation",
  description:
    "Bạn đang quản lý khách, đơn hàng, dữ liệu bằng Excel/Zalo quá rối? Gửi bài toán, nhận tư vấn và một web/tool nhỏ chạy được để giải quyết nhanh.",
  openGraph: {
    title: "AutoWeb Studio",
    description:
      "Biến bài toán thủ công thành web, tool và automation chạy được.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
