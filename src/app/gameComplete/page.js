import styles from "./page.module.css";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";
import Button from "@/components/Button";

let timeTaken = 5; // Example time taken in minutes
let starsEarned = 2; // Example stars earned

export default function GameCompletePage() {
  return (
    <main>
      <FotoguesserHeader />
      <div className={styles.container}>
        {/* Add stars component here */}
        <h1 className={styles.title}>Grattis!</h1>
        <p className={styles.description}>
          Du klarade spelet med {timeTaken} minuter kvar och fick därför{" "}
          {starsEarned} av 3 stjärnor!
        </p>
        <Button href="/" variant="light">
          Hem
        </Button>
        <Button href="/leaderboard" variant="light">
          Poängställning
        </Button>
      </div>
    </main>
  );
}
