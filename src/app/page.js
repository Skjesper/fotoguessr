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
            Gissa platsen utifrån en bild. Ta dig dit och bekräfta i appen för
            poäng. Ju snabbare du är desto högre poäng får du.
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <Button href="/onboarding" variant="dark">
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
