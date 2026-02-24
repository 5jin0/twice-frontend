import type { HTMLAttributes } from "react";

export interface PageContainerProps extends HTMLAttributes<HTMLElement> {
  narrow?: boolean;
  as?: "main" | "div";
  children: React.ReactNode;
}

export function PageContainer({
  narrow = false,
  as: Tag = "main",
  className = "",
  children,
  ...rest
}: PageContainerProps) {
  const layoutClass = narrow ? "page-container page-container--narrow" : "page-container";
  return (
    <Tag className={`${layoutClass} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
