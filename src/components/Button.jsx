"use client";

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant} // If we want to style different variants in CSS later, can be removed if we don't need it
    >
      {children}
    </button>
  );
}
