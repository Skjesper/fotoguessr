"use client";
import styles from "./Levels.module.css";

const Levels = ({
  number,
  timeSlot,
  isUnlocked,
  hasPlayed = false,
  onClick,
}) => {
  const handleClick = () => {
    if (isUnlocked && !hasPlayed && onClick) {
      onClick();
    }
  };

  return (
    <div className={styles.levelContainer}>
      <button
        type="button"
        className={`${styles.levelCircle} ${
          isUnlocked ? styles.unlocked : styles.locked
        } ${hasPlayed ? styles.completed : ""}`}
        onClick={handleClick}
        disabled={!isUnlocked || hasPlayed}
        aria-disabled={!isUnlocked || hasPlayed}
        aria-label={`Level ${number} ${timeSlot} ${
          hasPlayed ? "spelad" : isUnlocked ? "upplåst" : "låst"
        }`}
      >
        <div className={styles.levelContent}>
          <h2 className={styles.levelNumber}>{number}</h2>
          {!isUnlocked && (
            <div className={styles.lockIcon}>
              <img src="/lock.svg" alt="Lock Icon" width={19} height={26} />
            </div>
          )}
        </div>
      </button>
      <div className={styles.timeSlot}>{timeSlot}</div>
      {number < 3 && <div className={styles.connector}></div>}
    </div>
  );
};

// Helper function to see if a time slot is unlocked
export const isTimeSlotUnlocked = (timeSlot) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  // Convert time slots to minutes
  const timeSlots = {
    "08:00-11:00": { start: 8 * 60, end: 11 * 60 },
    "11:00-13:00": { start: 11 * 60, end: 13 * 60 },
    "13:00-17:00": { start: 13 * 60, end: 17 * 60 }, // Changed from 16:00 to 17:00
  };

  const slot = timeSlots[timeSlot];
  if (!slot) return false;

  return currentTime >= slot.start && currentTime <= slot.end;
};

// Function to check if the player has already played a specific time slot today
export const hasPlayedToday = (timeSlot) => {
  // Check if we're in the browser (client-side)
  if (typeof window === "undefined") return false;

  // Check against localStorage
  const playedToday = JSON.parse(localStorage.getItem("playedToday") || "{}");
  const today = new Date().toDateString();

  return playedToday[today] && playedToday[today].includes(timeSlot);
};

// Function to mark a time slot as played
export const markAsPlayed = (timeSlot) => {
  // Check if we're in the browser (client-side)
  if (typeof window === "undefined") return;

  const playedToday = JSON.parse(localStorage.getItem("playedToday") || "{}");
  const today = new Date().toDateString();

  if (!playedToday[today]) {
    playedToday[today] = [];
  }

  if (!playedToday[today].includes(timeSlot)) {
    playedToday[today].push(timeSlot);
  }

  localStorage.setItem("playedToday", JSON.stringify(playedToday));
};

export default Levels;
