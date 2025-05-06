import React from 'react';
import styles from './confirmmodal.module.scss';

/**
 * IConfirmModalProps defines the props for ConfirmModal component.
 */
export interface IConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}


/**
 * ConfirmModal displays a modal dialog with a message and OK/Cancel buttons.
 */

const ConfirmModal: React.FC<IConfirmModalProps> = ({ open, title = 'Are you sure?', message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonRow}>
          <button className={styles.button} onClick={onCancel}>Cancel</button>
          <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={onConfirm}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
