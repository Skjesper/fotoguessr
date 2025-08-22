import React from 'react';
import styles from './AcceptModal.module.css';

const AcceptModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Bekräfta", 
  message = "Är du säker?",
  confirmText = "Bekräfta",
  cancelText = "Avbryt"
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>
        
        <div className={styles.buttons}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptModal;