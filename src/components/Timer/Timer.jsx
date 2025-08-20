"use client";
import { useState, useEffect } from "react";
import styles from '@/components/Timer/Timer.module.css';

export default function Timer({ duration, onProgress, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Separerat useEffect för att hantera när timer är klar
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
    }
  }, [timeLeft, onComplete]);

  // Timer-logik utan callbacks
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Separerat useEffect för progress updates
  useEffect(() => {
    const progress = 1 - timeLeft / duration;
    onProgress?.(progress);
  }, [timeLeft, duration, onProgress]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      <div className={styles.timerBackground}>
        <div className={styles.timerNumbers}>
          <p>
            <span>{minutes.toString().padStart(2, '0')}</span>
            :
            <span>{seconds.toString().padStart(2, '0')}</span>
          </p>
          <div className={styles.timerText}>
            <span>MIN</span>
            <span>SEK</span>
          </div>
        </div>
      </div>
    </div>
  );
}