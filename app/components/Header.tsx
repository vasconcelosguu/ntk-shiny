"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DropdownItem = {
  label: string;
  href: string;
  emoji: string;
};

type DropdownProps = {
  label: string;
  emoji: string;
  items: DropdownItem[];
  active: boolean;
};

function Dropdown({
  label,
  emoji,
  items,
  active,
}: DropdownProps) {
  return (
    <div className="header-dropdown group relative">
      {/* BOTÃO */}
      <div
        className={[
          "header-dropdown-trigger",
          active ? "active" : "",
        ].join(" ")}
      >
        <span className="header-nav-emoji">{emoji}</span>

        <span>{label}</span>

        <span className="header-chevron">▾</span>
      </div>

      {/* DROPDOWN */}
      <div className="header-dropdown-menu">
        <div className="header-dropdown-glow" />

        <div className="header-dropdown-items">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="header-dropdown-item"
            >
              <span className="header-dropdown-item-icon">
                {item.emoji}
              </span>

              <span className="header-dropdown-item-label">
                {item.label}
              </span>

              <span className="header-dropdown-arrow">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();

  const shinyActive =
    pathname === "/shiny" ||
    pathname.startsWith("/shiny/");

  const toolsActive =
    pathname.startsWith("/tools/");

  const contentActive =
    pathname.startsWith("/content/");

  const pokedexActive =
    pathname.startsWith("/pokedex");

  const membersActive =
    pathname.startsWith("/members");

  return (
    <header className="site-header">
      <div className="header-inner">

        {/* LOGO */}
        <Link
          href="/"
          className="header-brand"
          aria-label="NeverTakeBan"
        >
          <Image
            src="/images/ntb-logo.png"
            alt="NeverTakeBan"
            width={150}
            height={52}
            priority
            className="header-logo"
          />
        </Link>

        {/* NAV */}
        <nav className="header-nav">

          {/* NEVER TAKE BAN */}
          <Dropdown
            label="NeverTakeBan"
            emoji="🟢"
            active={shinyActive}
            items={[
              {
                label: "Shiny Showcase",
                href: "/shiny",
                emoji: "✨",
              },
              {
                label: "Shiny Tiers",
                href: "/shiny/tiers",
                emoji: "🏆",
              },
            ]}
          />

          {/* POKEDEX */}
          <Link
            href="/pokedex"
            className={[
              "header-nav-link",
              pokedexActive ? "active" : "",
            ].join(" ")}
          >
            <span className="header-nav-emoji">
              📖
            </span>

            <span>Pokedex</span>
          </Link>

          {/* TOOLS */}
          <Dropdown
            label="Tools"
            emoji="🛠️"
            active={toolsActive}
            items={[
              {
                label: "Shiny Hunt Simulator",
                href: "/tools/shiny-hunt-simulator",
                emoji: "🎯",
              },
              {
                label: "Dex Nave",
                href: "/tools/dex-nave",
                emoji: "🧭",
              },
            ]}
          />

          {/* CONTENT */}
          <Dropdown
            label="Content"
            emoji="📚"
            active={contentActive}
            items={[
              {
                label: "Farm",
                href: "/content/farm",
                emoji: "💰",
              },
              {
                label: "Raids",
                href: "/content/raids",
                emoji: "👹",
              },
              {
                label: "Seasonal Events",
                href: "/content/seasonal-events",
                emoji: "📅",
              },
            ]}
          />

          {/* MEMBERS */}
          <Link
            href="/members"
            className={[
              "header-nav-link",
              membersActive ? "active" : "",
            ].join(" ")}
          >
            <span className="header-nav-emoji">
              👥
            </span>

            <span>Members</span>
          </Link>

        </nav>

        {/* STATUS */}
        <div className="team-status">
          <span className="team-status-dot" />
          Online
        </div>

      </div>
    </header>
  );
}