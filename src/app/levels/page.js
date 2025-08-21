"use client";
import styles from "./page.module.css";
import Image from "next/image";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";
import Levels, {
  isTimeSlotUnlocked,
  hasPlayedToday,
} from "@/components/Levels/Levels";
import { useRouter } from "next/navigation";

export default function LevelsPage() {
  const router = useRouter();

  const startGame = (levelNumber) => {
    // Navigate to game page or handle game start logic
    router.push(`/game?level=${levelNumber}`);
  };

  return (
    <main className={styles.mainContainer}>
      <FotoguesserHeader onArrowClick={() => router.back()} />
      <div className={styles.content}>
        <h1 className={styles.title}>Utmaningar</h1>
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
