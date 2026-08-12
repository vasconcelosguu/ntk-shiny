import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeverTakeBan • Shiny Database",
  description: "Database de Shinies do PokeMMO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="site-header">
          <div className="header-inner">

            <Link href="/" className="logo">
              <img
                src="/images/logo.png"
                alt="NeverTakeBan"
              />
            </Link>

            <nav className="nav">
              <Link href="/">
                Home
              </Link>

              <div className="nav-dropdown">
                <span className="nav-dropdown-title">
                  Tiers ▾
                </span>

                <div className="nav-dropdown-menu">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((tier) => (
                    <Link
                      key={tier}
                      href={`/tiers/${tier}`}
                    >
                      Tier {tier}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/players">
                Players
              </Link>

              <Link href="/guia">
                Guia
              </Link>

              <Link href="/about">
                About
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="footer-inner">
            <strong>NeverTakeBan</strong>

            <span>
              Shiny Database • PokeMMO
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}