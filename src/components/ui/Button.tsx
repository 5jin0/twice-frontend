import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const variantClass = variant === "primary" ? "btn--primary" : "btn--secondary";
  return (
    <button
      type="button"
      className={`btn ${variantClass} ${className}`.trim()}
      disabled={disabled ?? loading}
      {...rest}
    >
      {loading ? "처리 중..." : children}
    </button>
  );
}
