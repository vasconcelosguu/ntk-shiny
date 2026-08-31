import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Never Take Ban | PokeMMO Team",
  description:
    "Shinies, eventos, raids, ferramentas e informações do time Never Take Ban.",
};

const navigation = [
  { label: "Shiny", href: "/shiny" },
  { label: "Eventos", href: "/eventos" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Raids", href: "/raid" },
  { label: "Tools", href: "/tools" },
  { label: "Members", href: "/members" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#030603] text-white antialiased">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="sticky top-0 z-50 border-b border-lime-400/[0.08] bg-[#030603]/95 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1500px] items-center px-5 lg:px-8">
            
            {/* LOGO */}

            <Link
              href="/"
              className="
                group
                flex
                h-full
                w-[190px]
                shrink-0
                items-center
                justify-start
                border-r
                border-white/[0.05]
              "
            >
              <img
                src="/images/ntb-logo.png"
                alt="Never Take Ban"
                className="
                  h-[68px]
                  w-auto
                  object-contain
                  object-left
                  transition-transform
                  duration-300
                  group-hover:scale-[1.03]
                "
              />
            </Link>

            {/* NAVIGATION */}

            <nav className="ml-auto flex h-full items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    relative
                    flex
                    h-full
                    items-center
                    px-5
                    text-[13px]
                    font-black
                    uppercase
                    italic
                    tracking-wide
                    text-gray-300
                    transition-all
                    duration-200
                    hover:text-lime-400
                  "
                >
                  {item.label}

                  <span
                    className="
                      absolute
                      bottom-0
                      left-1/2
                      h-[2px]
                      w-0
                      -translate-x-1/2
                      bg-lime-400
                      shadow-[0_0_12px_rgba(163,230,53,0.8)]
                      transition-all
                      duration-300
                      group-hover:w-full
                    "
                  />
                </Link>
              ))}
            </nav>

            {/* TEAM ONLINE */}

            <div
              className="
                ml-8
                hidden
                h-full
                items-center
                border-l
                border-white/[0.05]
                pl-8
                lg:flex
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-lime-400/20
                  bg-lime-400/[0.03]
                  px-4
                  py-2
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-lime-400
                "
              >
                <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.8)]" />
                Team Online
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            PAGE
        ===================================================== */}

        {children}
      </body>
    </html>
  );
}