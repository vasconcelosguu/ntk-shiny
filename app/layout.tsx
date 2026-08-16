import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "neverTakeBan • PokeMMO Team",
  description:
    "Portal do time neverTakeBan no PokeMMO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="site-header">
          <div className="header-inner">

            {/* LOGO */}

            <Link
              href="/"
              className="header-brand"
              aria-label="neverTakeBan"
            >
              <Image
                src="/images/ntb-logo.png"
                alt="neverTakeBan"
                width={95}
                height={95}
                priority
                className="header-logo"
              />
            </Link>

            {/* NAV */}

            <nav className="header-nav">

              <Link href="/">
                Início
              </Link>

              <Link href="/farm">
                Farm
              </Link>

              <Link href="/hunt">
                Hunt
              </Link>

              <Link href="/raid">
                RAID
              </Link>

              <Link href="/eventos">
                Eventos
              </Link>

              <Link href="/ajuda">
                Ajuda
              </Link>

            </nav>

            {/* STATUS */}

            <div className="team-status">
              <span className="team-status-dot" />
              <span>Team Online</span>
            </div>

          </div>
        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        {children}

      </body>
    </html>
  );
}