import styles from "./Stars.module.css";

export default function Stars({ count = 0 }) {
  const safeCount = Math.max(0, Math.min(3, Math.floor(count)));
  return (
    <div
      className={styles.starsContainer}
      aria-label={`${safeCount} av 3 stjärnor`}
      role="img"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <span key={index} className={styles.star}>
          <img
            src={index < safeCount ? "/filled-star.svg" : "/empty-star.svg"}
            alt=""
            aria-hidden="true"
            className={styles.icon}
          />
        </span>
      ))}
    </div>
  );
}
