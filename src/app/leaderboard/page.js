"use client";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [leaders, setLeaders] = useState([]);

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
    <div>
      <h1>Leaderboard</h1>
      <form onSubmit={submitScore}>
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
      </form>

      <ul>
        {leaders.map((entry) => (
          <li key={entry.id}>
            {entry.name} – {entry.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
