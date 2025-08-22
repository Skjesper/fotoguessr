import React from "react";
import styles from "@/components/FotoguesserHeader/FotoguesserHeader.module.css";

const FotoguesserHeader = ({ onArrowClick }) => {
  return (
    <header className={styles.headerSection}>
      <svg
        className={styles.arrowIcon}
        xmlns="http://www.w3.org/2000/svg"
        width="35"
        height="35"
        viewBox="0 0 35 35"
        fill="none"
        onClick={onArrowClick}
        style={{ cursor: onArrowClick ? "pointer" : "default" }}
      >
        <path
          d="M17.5 0.03125C7.85271 0.03125 0.03125 7.85271 0.03125 17.5C0.03125 27.1473 7.85271 34.9688 17.5 34.9688C27.1473 34.9688 34.9688 27.1473 34.9688 17.5C34.9688 7.85271 27.1473 0.03125 17.5 0.03125ZM20.4655 24.6126C20.5955 24.7362 20.6995 24.8845 20.7713 25.0489C20.8431 25.2132 20.8813 25.3903 20.8836 25.5696C20.8859 25.749 20.8523 25.927 20.7847 26.0931C20.7171 26.2592 20.617 26.4102 20.4901 26.537C20.3633 26.6638 20.2124 26.764 20.0462 26.8316C19.8801 26.8991 19.7021 26.9328 19.5227 26.9305C19.3434 26.9282 19.1663 26.89 19.002 26.8182C18.8376 26.7464 18.6893 26.6424 18.5658 26.5124L10.5033 18.4499C10.2515 18.1979 10.11 17.8562 10.11 17.5C10.11 17.1438 10.2515 16.8021 10.5033 16.5501L18.5658 8.48764C18.8198 8.24627 19.1581 8.1137 19.5085 8.11819C19.8589 8.12267 20.1937 8.26386 20.4415 8.51165C20.6893 8.75944 20.8305 9.09423 20.8349 9.44462C20.8394 9.79502 20.7069 10.1333 20.4655 10.3874L13.3537 17.5L20.4655 24.6126Z"
          fill="#5E5C20"
        />
      </svg>
      <h1 className={styles.headerH1}>FOTOGUESSR</h1>
    </header>
  );
};

export default FotoguesserHeader;
