"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";
import Levels, {
  isTimeSlotUnlocked,
  hasPlayedToday,
} from "@/components/Levels/Levels";

export default function LevelsPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Vänta tills vi är på klientsidan
    setIsClient(true);
    const savedPlayerName = localStorage.getItem("playerName");
    setPlayerName(savedPlayerName);
  }, []);

  const startGame = (levelNumber) => {
    // Navigate to game page or handle game start logic
    router.push(`/gamePage?level=${levelNumber}`);
  };

  // Visa loading medan vi väntar på client-side rendering
  if (!isClient) {
    return <div>Laddar...</div>;
  }

  return (
    <main className={styles.mainContainer}>
      <FotoguesserHeader onArrowClick={() => router.push("/")} />
      <div className={styles.content}>
        <div className={styles.header}>
          {playerName && (
            <p className={styles.welcomeText}>Spelar som: {playerName}</p>
          )}
          <h1 className={styles.title}>Utmaningar</h1>
        </div>
        <section className={styles.levelsContainer}>
          <Levels
            number={1}
            timeSlot="08:00-11:00"
            isUnlocked={isTimeSlotUnlocked("08:00-11:00")}
            hasPlayed={hasPlayedToday("08:00-11:00")}
            onClick={() => startGame(1)}
          />
          <Image
            src="/timemarker.svg"
            alt="timeline marker"
            height={44}
            width={7}
          />

          <Levels
            number={2}
            timeSlot="11:00-13:00"
            isUnlocked={isTimeSlotUnlocked("11:00-13:00")}
            hasPlayed={hasPlayedToday("11:00-13:00")}
            onClick={() => startGame(2)}
          />
          <Image
            src="/timemarker.svg"
            alt="timeline marker"
            height={44}
            width={7}
          />
          <Levels
            number={3}
            timeSlot="13:00-17:00"
            isUnlocked={isTimeSlotUnlocked("13:00-17:00")}
            hasPlayed={hasPlayedToday("13:00-17:00")}
            onClick={() => startGame(3)}
          />
        </section>
      </div>
    </main>
  );
}
