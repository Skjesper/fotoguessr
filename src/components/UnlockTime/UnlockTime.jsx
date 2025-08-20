'use client'

import styles from '@/components/UnlockTime/UnlockTime.module.css';

export default function UnlockTime({ children }) {
  return (
    <>
    <section className= {styles.unlockTimeSection}>
      <h3 className={styles.text}>Stängs</h3>
      <div className={styles.unlockTime}>
        {children}
      </div>
      </section>
    </>
  );
}