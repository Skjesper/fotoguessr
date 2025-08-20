'use client'

import styles from '@/components/MiniLevel/Minilevel.module.css';

export default function Minilevel({ level }) {
  return (
    <>
      <section className={styles.minilevelSection}>
        <h3 className={styles.text}>Level</h3>
        <div className={styles.miniLevel}>
          {level}
        </div>
      </section>
    </>
  );
}