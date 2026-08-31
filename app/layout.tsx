import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "NeverTakeBan",
  description: "Time NeverTakeBan — PokeMMO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#030703] text-white antialiased">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <header className="site-header">
          <div className="header-inner">

            {/* =================================================
                LOGO
            ================================================= */}
            <Link
              href="/"
              aria-label="NeverTakeBan"
              className="header-brand"
            >
              <Image
                src="/images/ntb-logo.png"
                alt="NeverTakeBan"
                width={190}
                height={90}
                priority
                className="header-logo"
              />
            </Link>

            {/* =================================================
                NAV
            ================================================= */}
            <nav className="header-nav">
              <Link href="/shiny">Shiny</Link>
              <Link href="/eventos">Eventos</Link>
              <Link href="/leaderboard">Leaderboard</Link>
              <Link href="/raid">Raids</Link>
              <Link href="/tools">Tools</Link>
              <Link href="/members">Members</Link>
            </nav>

            {/* =================================================
                STATUS
            ================================================= */}
            <div className="team-status">
              <span className="team-status-dot" />
              <span>TEAM ONLINE</span>
            </div>

          </div>
        </header>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}
        {children}
      </body>
    </html>
  );
}