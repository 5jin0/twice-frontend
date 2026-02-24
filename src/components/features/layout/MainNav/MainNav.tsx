import Link from "next/link";

export interface MainNavLink {
  href: string;
  label: string;
}

export interface MainNavProps {
  links?: MainNavLink[];
}

const DEFAULT_LINKS: MainNavLink[] = [
  { href: "/login", label: "로그인" },
  { href: "/quiz", label: "퀴즈" },
  { href: "/dashboard", label: "대시보드" },
];

export function MainNav({ links = DEFAULT_LINKS }: MainNavProps) {
  return (
    <nav className="nav-links">
      {links.map(({ href, label }) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
