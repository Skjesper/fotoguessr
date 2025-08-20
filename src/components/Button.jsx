"use client";
import Link from "next/link";
import styles from "./Button.module.css";

// Usage as a navigation button:
// <Button href="/play">Play</Button>

// Usage as an action button:
// <Button onClick={handleStart}>Start Timer</Button>

// Usage with icon:
// <Button href="/leaderboard" icon={<LeaderboardIcon />}>Leaderboard</Button>

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  disabled = false,
  icon,
  ...props
}) {
  const buttonContent = (
    <>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </>
  );

  // If href prop is passed, render a Link (styled like a button)
  if (href) {
    return (
      <Link
        href={href}
        className={styles.button}
        data-variant={variant}
        {...props}
      >
        {buttonContent}
      </Link>
    );
  }

  // Otherwise, render a real button
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles.button}
      data-variant={variant}
      {...props}
    >
      {buttonContent}
    </button>
  );
}
