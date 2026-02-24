import Link from "next/link";
import type { HTMLAttributes } from "react";

export interface DashboardNavProps extends HTMLAttributes<HTMLElement> {
  /** no extra props */
}

export function DashboardNav({ className = "", ...rest }: DashboardNavProps) {
  return (
    <nav className={`nav-links ${className}`.trim()} aria-label="대시보드 메뉴" {...rest}>
      <Link href="/quiz">퀴즈로 이동</Link>
      <Link href="/login">로그인</Link>
    </nav>
  );
}
