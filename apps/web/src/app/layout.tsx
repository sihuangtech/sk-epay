import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sk-epay",
  description: "现代化标准易支付聚合支付系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
