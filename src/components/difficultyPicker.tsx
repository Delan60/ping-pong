import React from 'react';
import styles from './difficultyPicker.module.css';

export type Difficulty = 'easy' | 'normal' | 'hard';

interface DifficultyPickerProps {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  compact?: boolean; // smaller sizing for overlay use
}

export const DifficultyPicker: React.FC<DifficultyPickerProps> = ({
  value,
  onChange,
  disabled,
  label = 'Difficulty: ',
  className,
  compact = false,
}) => {
  return (
    <div
      className={[
        styles.root,
        compact ? styles.compact : '',
        className || '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label>
        {label}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as Difficulty)}
          disabled={disabled}
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </label>
    </div>
  );
};
