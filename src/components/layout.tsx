import type { FC, ReactNode } from 'react';

interface LayoutProps { children: ReactNode }
import { PLAYFIELD_HEIGHT_PX } from '../gameConfig';

import styles from './layout.module.css';

export const Layout: FC<LayoutProps> = ({ children }) => (
  <div className={styles.layoutRoot}>
    <div className={styles.layoutContent} style={{height: `${PLAYFIELD_HEIGHT_PX}px`}}>{children}</div>
  </div>
);
