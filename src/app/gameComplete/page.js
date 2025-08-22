"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";
import Button from "@/components/Button";
import Stars from "@/components/Stars/Stars";
import Image from "next/image";

function GameCompleteContent() {
  const searchParams = useSearchParams();

  // Läs data från URL
  const level = parseInt(searchParams.get("level")) || 1;
  const success = searchParams.get("success") === "true";
  const distance = parseFloat(searchParams.get("distance")) || 0;
  const timeRemainingMs = parseInt(searchParams.get("timeRemaining")) || 0;
  const target = searchParams.get("target") || "missed";
  const targetLat = parseFloat(searchParams.get("targetLat"));
  const targetLng = parseFloat(searchParams.get("targetLng"));

  // Konvertera tid kvar till sekunder (timeRemaining kommer i sekunder, inte millisekunder)
  const secondsLeft = timeRemainingMs;

  // Beräkna stjärnor baserat på tid kvar OCH om de klarade det
  const calculateStars = () => {
    if (!success) return 0; // Inga stjärnor om de misslyckades

    if (secondsLeft >= 1200) return 3; // 20+ minuter kvar = 3 stjärnor
    if (secondsLeft >= 600) return 2; // 10-20 minuter kvar = 2 stjärnor
    if (secondsLeft > 0) return 1; // 0-10 minuter kvar = 1 stjärna
    return 0; // Tiden tog slut = 0 stjärnor
  };

  const starsEarned = calculateStars();

  // Formatera tid för visning
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins} minut${mins !== 1 ? "er" : ""} och ${secs} sekund${
        secs !== 1 ? "er" : ""
      }`;
    }
    return `${secs} sekund${secs !== 1 ? "er" : ""}`;
  };

  return (
    <main className={styles.main}>
      <section className={styles.infoContainer}>
        <Stars count={starsEarned} />

        {success ? (
          <>
            <h1 className={styles.title}>Grattis!</h1>
            <p className={styles.description}>
              Du klarade Level {level} med{" "}
              <strong>{formatTime(secondsLeft)}</strong> kvar och var endast{" "}
              <strong>{distance} meter</strong> från målet! Du fick därför{" "}
              <strong>{starsEarned} av 3 stjärnor!</strong>
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Fel plats!</h1>
            <p className={styles.description}>
              Du var <strong>{distance} meter</strong> från målet och fick
              därför <strong>0 av 3 stjärnor!</strong>
            </p>
          </>
        )}

        {/* Visa karta med målplatsen */}
        {targetLat && targetLng && (
          <div className={styles.mapContainer}>
            <h3 className={styles.mapTitle}>Här var målplatsen:</h3>
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${targetLat},${targetLng}&zoom=16&size=300x200&markers=color:red%7C${targetLat},${targetLng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
              alt="Målplats på karta"
              className={styles.mapImage}
              onClick={() => window.open(`https://maps.google.com/?q=${targetLat},${targetLng}`, '_blank')}
              style={{ cursor: 'pointer' }}
            />
          </div>

          )}
        

        <Button
          href="/"
          variant="light"
          icon={
            <Image src="/home-dark.svg" alt="Home" width={16} height={16} />
          }
        >
          Hem
        </Button>
        <Button
          href={`/leaderboard?stars=${starsEarned}&level=${level}`}
          variant="light"
          icon={
            <Image src="/trophy-dark.svg" alt="Trophy" width={16} height={16} />
          }
        >
          Poängställning
        </Button>
      </section>
    </main>
  );
}

export default function GameCompletePage() {
  return (
    <Suspense fallback={<div>Laddar resultat...</div>}>
      <GameCompleteContent />
    </Suspense>
  );
}
