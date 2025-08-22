"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./leaderboard.module.css";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Läs stjärnor från URL
  const newStars = parseInt(searchParams.get("stars")) || 0;
  const level = parseInt(searchParams.get("level")) || 0;

  useEffect(() => {
    // Om det finns nya stjärnor, spara dem automatiskt
    if (newStars > 0) {
      const playerName = localStorage.getItem("playerName");
      if (playerName) {
        submitScore(playerName, newStars);
      }
    }

    // Hämta leaderboard
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => b.score - a.score);
        setLeaders(sorted);
      });
  }, [newStars]);

  const submitScore = async (name, score) => {
    try {
      await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          score,
          action: "add", // indikerar att vi vill lägga till stjärnor
        }),
      });

      // Hämta uppdaterad leaderboard efter att vi sparat
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      const sorted = data.sort((a, b) => b.score - a.score);
      setLeaders(sorted);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

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
