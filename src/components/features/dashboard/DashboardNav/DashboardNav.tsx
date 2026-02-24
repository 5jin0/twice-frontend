import Link from "next/link";

const LINKS = [
  { href: "/quiz", label: "퀴즈로 이동" },
  { href: "/login", label: "로그인" },
];

export function DashboardNav() {
  return (
    <nav className="nav-links">
      {LINKS.map(({ href, label }) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
