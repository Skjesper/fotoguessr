import styles from "./page.module.css";
import Button from "@/components/Button";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <Image src="/logo.svg" alt="App logo" width={115.094} height={122} />
        <h1>FOTOGUESSR</h1>
        <p>
          Välkommen till Lindholmen Guesser! Testa din kunskap om Lindholmen
          genom att gissa platser baserat på bilder.
        </p>
        <Button href="/levels">Spela</Button>
        <Button href="/leaderboard">Poängställning</Button>
      </section>
    </main>
  );
}
