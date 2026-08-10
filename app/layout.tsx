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
              <span>Never</span>TakeBan
            </Link>

            <nav className="nav">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((tier) => (
                <Link key={tier} href={`/tiers/${tier}`}>
                  T{tier}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="footer-inner">
            <strong>NeverTakeBan</strong>
            <span>Shiny Database • PokeMMO</span>
          </div>
        </footer>
      </body>
    </html>
  );
}