import React from 'react';
import styles from './winnerNameForm.module.css';

export interface WinnerNameFormProps {
  winnerSide: 'left' | 'right';
  defaultName?: string; // placeholder / fallback when empty
  onSubmit: (name: string) => void;
  autoFocus?: boolean;
}

export const WinnerNameForm: React.FC<WinnerNameFormProps> = ({
  winnerSide,
  defaultName,
  onSubmit,
  autoFocus,
}) => {
  const [name, setName] = React.useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = name.trim() || defaultName || (winnerSide === 'left' ? 'Left' : 'Right');
        onSubmit(trimmed);
      }}
      className={styles.form}
    >
      <label className={styles.label}>
        Winner name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={defaultName || (winnerSide === 'left' ? 'Left' : 'Right')}
          className={styles.input}
          autoFocus={autoFocus}
        />
      </label>
      <button type="submit" className={styles.submitButton}>Save & Next Match</button>
    </form>
  );
};
