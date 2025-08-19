"use client";
import { useState, useEffect } from "react";

/*
  Timer component

  - Purpose:
    Small client-side countdown timer that starts at `duration` (seconds)
    and ticks down once per second. It reports progress via `onProgress`
    and notifies when the timer completes via `onComplete`.

  - Props:
    duration   (number)   - starting time in seconds
    onProgress (function) - optional, called each second with a value in [0, 1]
                            where 0 means just started and 1 means finished.
    onComplete (function) - optional, called once when time reaches 0.

*/

export default function Timer({ duration, onProgress, onComplete }) {
  // remaining time in seconds
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // If we've reached zero or below, notify via onComplete and stop.
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      return;
    }

    // Create an interval that decrements the remaining time every second.
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        // Report progress as a fraction between 0 and 1.
        // 1 - next / duration => when next === duration => 0, when next === 0 => 1
        if (onProgress) {
          onProgress(1 - next / duration);
        }
        return next;
      });
    }, 1000);

    // Cleanup interval when the effect re-runs or the component unmounts.
    return () => clearInterval(interval);
  }, [timeLeft, duration, onProgress, onComplete]);

  // Simple visual: seconds left. Change to mm:ss if you prefer a formatted time.
  return (
    <div>
      <p>⏱ {timeLeft}s kvar</p>
    </div>
  );
}
