import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "neverTakeBan • PokeMMO Team",
  description: "Portal oficial do time neverTakeBan no PokeMMO.",
};

const navItems = [
  {
    name: "Início",
    href: "/",
  },
  {
    name: "Farm",
    href: "/farm",
  },
  {
    name: "Hunt",
    href: "/hunt",
  },
  {
    name: "RAID",
    href: "/raid",
  },
  {
    name: "Eventos",
    href: "/eventos",
  },
  {
    name: "Ajuda",
    href: "/ajuda",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#080b14] text-white antialiased">

        {/* =========================
            HEADER GLOBAL
        ========================= */}

        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080b14]/85 backdrop-blur-xl">

          <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-6">

            {/* LOGO */}

            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-lg shadow-lg shadow-violet-950/20 transition duration-200 group-hover:border-violet-500/40 group-hover:bg-violet-500/15">
                ✨
              </div>

              <div className="hidden sm:block">
                <div className="text-sm font-black tracking-tight text-white">
                  neverTakeBan
                </div>

                <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                  PokeMMO Team
                </div>
              </div>
            </Link>

            {/* NAVIGATION */}

            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 transition duration-200 hover:bg-white/[0.045] hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* STATUS */}

            <div className="hidden items-center gap-2 lg:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-xs font-semibold text-gray-600">
                Team Online
              </span>
            </div>

          </div>
        </header>

        {/* CONTEÚDO */}

        {children}

        {/* FOOTER GLOBAL */}

        <footer className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <span className="text-sm font-bold text-gray-500">
              neverTakeBan
            </span>

            <span className="text-xs text-gray-700">
              PokeMMO • Team Portal
            </span>

          </div>
        </footer>

      </body>
    </html>
  );
}