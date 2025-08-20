"use client";
import { useState, useEffect } from "react";
import styles from '@/components/Timer/Timer.module.css';

export default function Timer({ duration, onProgress, onComplete }) {
 const [timeLeft, setTimeLeft] = useState(duration);

 useEffect(() => {
   if (timeLeft <= 0) {
     onComplete?.();
     return;
   }

   const interval = setInterval(() => {
     setTimeLeft((prev) => {
       const next = prev - 1;
       onProgress?.(1 - next / duration);
       return next;
     });
   }, 1000);

   return () => clearInterval(interval);
 }, [timeLeft, duration, onProgress, onComplete]);

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