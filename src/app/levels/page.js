import styles from "./page.module.css";
import Image from "next/image";

export default function LevelsPage() {
  return (
    <main className={styles.mainContainer}>
      {/* Add fotoguessrback here */}
      <p className={styles.description}>Spelar som:</p>
      <div className={styles.levels}></div>
    </main>
  );
}
