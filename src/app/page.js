import styles from "./page.module.css";
import Button from "@/components/Button";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <div className={styles.textImageContainer}>
          <Image src="/logo.svg" alt="App logo" width={115.094} height={122} />
          <h1 className={styles.title}>FOTOGUESSR</h1>
          <p className={styles.description}>
            Gissa bilden, hitta platsen och tagga dig själv. Men låt inte dina
            poäng ticka bort, för ju snabbare du är, desto fler poäng får du.
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <Button href="/levels" variant="dark">
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
