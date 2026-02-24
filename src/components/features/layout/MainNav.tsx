import Link from "next/link";
import type { HTMLAttributes } from "react";

export interface NavItem {
  href: string;
  label: string;
}

const DEFAULT_ITEMS: NavItem[] = [
  { href: "/login", label: "로그인" },
  { href: "/quiz", label: "퀴즈" },
  { href: "/dashboard", label: "대시보드" },
];

export interface MainNavProps extends HTMLAttributes<HTMLElement> {
  items?: NavItem[];
}

export function MainNav({ items = DEFAULT_ITEMS, className = "", ...rest }: MainNavProps) {
  return (
    <nav className={`nav-links ${className}`.trim()} aria-label="메인 메뉴" {...rest}>
      {items.map(({ href, label }) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
