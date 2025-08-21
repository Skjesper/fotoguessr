"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./leaderboard.module.css";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";

export default function LeaderboardPage() {
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [leaders, setLeaders] = useState([]);
  const router = useRouter();

  // Get the leaderboard
  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        // Sort list by score
        const sorted = data.sort((a, b) => b.score - a.score);
        setLeaders(sorted);
      });
  }, []);

  const submitScore = async (e) => {
    e.preventDefault();
    await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score: Number(score) }),
    });
    // Update the leaderboard
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    const sorted = data.sort((a, b) => b.score - a.score);
    setLeaders(sorted);
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
                <span className={styles.itemScore}>{entry.score}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
