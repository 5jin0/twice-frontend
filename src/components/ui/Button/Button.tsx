import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      className={`btn btn--${variant} ${className}`.trim()}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? "처리 중..." : children}
    </button>
  );
}
