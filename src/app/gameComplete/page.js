import styles from "./page.module.css";
import FotoguesserHeader from "@/components/FotoguesserHeader/FotoguesserHeader";
import Button from "@/components/Button";

let timeTaken = 5; // Example time taken in minutes
let starsEarned = 2; // Example stars earned

export default function GameCompletePage() {
  return (
    <main className={styles.main}>
      <FotoguesserHeader />
      <section className={styles.infoContainer}>
        {/* <div className={styles.contentContainer}> */}
        {/* Add stars component here */}
        <h1 className={styles.title}>Grattis!</h1>
        <p className={styles.description}>
          Du klarade spelet med <strong>{timeTaken} minuter</strong> kvar och
          fick därför <strong>{starsEarned} av 3 stjärnor!</strong>
        </p>
        <Button href="/" variant="light">
          Hem
        </Button>
        <Button href="/leaderboard" variant="light">
          Poängställning
        </Button>
        {/* </div> */}
      </section>
    </main>
  );
}
