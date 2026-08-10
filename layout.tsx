import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "neverTakeBan — Shiny Database",
  description: "Tier list de shinies do neverTakeBan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="siteHeader">
          <Link className="brand" href="/">
            <span>never</span>TakeBan
          </Link>

          <nav className="nav">
            {Array.from({ length: 8 }, (_, i) => (
              <Link key={i} href={`/tiers/${i}`}>
                T{i}
              </Link>
            ))}
          </nav>
        </header>

        {children}

        <footer>neverTakeBan • Shiny Database</footer>
      </body>
    </html>
  );
}