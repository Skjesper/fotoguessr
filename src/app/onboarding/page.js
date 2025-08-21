"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";
import styles from "./page.module.css";
import Router from "next/router";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSaveAndPlay = () => {
    if (name.trim()) {
      localStorage.setItem("playerName", name.trim());
      router.push("/levels");
    }
  };

  const handlePlayAsGuest = () => {
    localStorage.removeItem("playerName"); // Removes saved player names from local storage
    router.push("/levels");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <FotoguesserHeader onArrowClick={() => router.back()} />

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
            placeholder="Skriv ditt namn här"
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
    </div>
  );
}
