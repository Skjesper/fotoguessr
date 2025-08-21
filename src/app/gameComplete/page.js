import styles from "./page.module.css";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";
import Button from "@/components/Button";
import Stars from "@/components/Stars/Stars";
import Image from "next/image";

let timeTaken = 12; // Example time taken in minutes
let starsEarned = 2; // Example stars earned

export default function GameCompletePage() {
  return (
    <main className={styles.main}>
      <FotoguesserHeader />
      <section className={styles.infoContainer}>
        {/* Add stars component here */}
        <Stars count={starsEarned} />
        <h1 className={styles.title}>Grattis!</h1>
        <p className={styles.description}>
          Du klarade spelet med <strong>{timeTaken} minuter</strong> kvar och
          fick därför <strong>{starsEarned} av 3 stjärnor!</strong>
        </p>
        <Button
          href="/"
          variant="light"
          icon={
            <Image src="/home-dark.svg" alt="Trophy" width={16} height={16} />
          }
        >
          Hem
        </Button>
        <Button
          href="/leaderboard"
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
