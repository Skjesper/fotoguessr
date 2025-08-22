  "use client";
import { Suspense } from 'react';

function LeaderboardContent() {

  const { useEffect, useState } = require("react");
  const { useRouter, useSearchParams } = require("next/navigation");
  const styles = require("./leaderboard.module.css");
  const FotoguesserHeader = require("@/components/FotoguesserHeader/FotoguesserHeader").default;

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

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div>Laddar leaderboard...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}