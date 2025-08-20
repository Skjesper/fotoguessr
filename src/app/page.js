import styles from "./page.module.css";
import Button from "@/components/Button";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <Image src="/logo.svg" alt="App logo" width={115.094} height={122} />
        <h1 className={styles.title}>FOTOGUESSR</h1>
        <p className={styles.description}>
          Gissa bilden, hitta platsen och tagga dig själv. Men låt inte dina
          poäng ticka bort, för ju snabbare du är, desto fler poäng får du.
        </p>
        <Button href="/levels">Spela</Button>
        <Button href="/leaderboard">Poängställning</Button>
      </section>
    </main>
  );
}
