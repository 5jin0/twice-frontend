import type { HTMLAttributes } from "react";

export interface PageContainerProps extends HTMLAttributes<HTMLElement> {
  narrow?: boolean;
  as?: "main" | "div" | "section";
}

export function PageContainer({
  narrow = false,
  as: Tag = "main",
  className = "",
  children,
  ...props
}: PageContainerProps) {
  return (
    <Tag
      className={`page-container ${narrow ? "page-container--narrow" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}
