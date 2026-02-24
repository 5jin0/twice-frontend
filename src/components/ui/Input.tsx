import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...rest }: InputProps) {
  const inputId = id ?? rest.name ?? label;
  return (
    <div className="form-group">
      <label htmlFor={inputId} className="label">
        {label}
      </label>
      <input
        id={inputId}
        className={`input ${className}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
