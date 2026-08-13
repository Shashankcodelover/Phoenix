import "./globals.css";

export const metadata = {
  title: "Project Phoenix v23.0 — Autonomous Career & Hackathon OS",
  description: "Next.js 15 & React 19 Enterprise Career Platform with KCET/DCET Rank Prediction, <300ms Real-Time Voice Coaching, and Discord-like Hackathon Split-Chat Workspaces.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#070B14] text-slate-100">{children}</body>
    </html>
  );
}
