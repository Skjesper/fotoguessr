"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Button from "@/components/Button";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Wait for the component to mount before accessing localStorage
    setIsClient(true);
    const savedPlayerName = localStorage.getItem("playerName");
    setPlayerName(savedPlayerName);
  }, []);

  const handlePlayClick = () => {
    // If playerName exists, navigate to levels, otherwise to onboarding
    if (playerName) {
      // Jump directly to levels if the name exists
      router.push("/levels");
    } else {
      // Go to onboarding if no name is saved
      router.push("/onboarding");
    }
  };

  // Show loading message while waiting for client-side rendering
  if (!isClient) {
    return <div>Laddar...</div>;
  }

  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <div className={styles.textImageContainer}>
          <Image src="/logo.svg" alt="App logo" width={115.094} height={122} />
          <h1 className={styles.title}>FOTOGUESSR</h1>
          <p className={styles.description}>
            Gissa platsen utifrån en bild. Ta dig dit och bekräfta i appen för
            poäng. Ju snabbare du är desto högre poäng får du.
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <Button onClick={handlePlayClick} variant="dark">
            Spela
          </Button>
          <Button
            href="/leaderboard"
            variant="dark"
            icon={
              <Image src="/trophy.svg" alt="Trophy" width={16} height={16} />
            }
          >
            Poängställning
          </Button>
        </div>
      </section>
    </main>
  );
}
