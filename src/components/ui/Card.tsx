import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export function Card({ title, children, className = "", ...rest }: CardProps) {
  return (
    <section className={`card ${className}`.trim()} {...rest}>
      {title && <h2 className="card__title">{title}</h2>}
      <div className="card__body">{children}</div>
    </section>
  );
}
