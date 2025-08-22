"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";
import styles from "./page.module.css";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSaveAndPlay = () => {
    if (name.trim() && isClient) {
      localStorage.setItem("playerName", name.trim());
      router.push("/levels");
    }
  };

  const handlePlayAsGuest = () => {
    if (isClient) {
      localStorage.removeItem("playerName");
    }
    router.push("/levels");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <main className={styles.maincontainer}>
      <FotoguesserHeader onArrowClick={handleBack} />

      <div className={styles.content}>
        <p className={styles.description}>
          Vill du spara dina poäng? Fyll i ditt namn så känner vi igen dig nästa
          gång du spelar.
        </p>

        <div className={styles.inputSection}>
          <label className={styles.label}>Namn</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.nameInput}
          />
        </div>

        <div className={styles.buttonSection}>
          <Button
            onClick={handleSaveAndPlay}
            variant="primary"
            disabled={!name.trim()}
          >
            Spara & spela
          </Button>

          <Button onClick={handlePlayAsGuest} variant="secondary">
            Spela som gäst
          </Button>
        </div>
      </div>
    </main>
  );
}