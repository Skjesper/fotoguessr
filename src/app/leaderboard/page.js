"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./leaderboard.module.css";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";

function LeaderboardContent() {
  const [leaders, setLeaders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Hämta leaderboard
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => b.score - a.score);
        setLeaders(sorted);
      });
  }, []);

  return (
    <div className={styles.container}>
      <FotoguesserHeader onArrowClick={() => router.back()} />
      <div className={styles.leaderboard}>
        <ul className={styles.list}>
          {leaders.map((entry, index) => (
            <li key={entry.id}>
              <div className={styles.item}>
                <span className={styles.rank}>{index + 1}</span>
                <span className={styles.itemName}>{entry.name}</span>
                <div className={styles.itemScore}>
                  <img
                    src="/tinystar.svg"
                    alt="star"
                    className={styles.starIcon}
                  />
                  {entry.score}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div>Laddar leaderboard...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
