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
      .then(setLeaders);
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
    setLeaders(await res.json());
  };

  return (
    <div className={styles.container}>
      <FotoguesserHeader onArrowClick={() => router.back()} />
      {/* <form onSubmit={submitScore}>
        <input
          type="text"
          placeholder="Namn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Poäng"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
        <button type="submit">Skicka</button>
      </form> */}
      <div className={styles.leaderboard}>
        <ul className={styles.list}>
          {leaders.map((entry) => (
            <li key={entry.id}>
              <div className={styles.item}>
                <span className={styles.itemName}>{entry.name}</span>
                <span className={styles.itemScore}> – {entry.score}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
