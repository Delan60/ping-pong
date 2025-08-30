import type { FC, ReactNode } from 'react';
import styles from './layout.module.css';

interface LayoutProps { children: ReactNode }

export const Layout: FC<LayoutProps> = ({ children }) => (
  <div className={styles.layoutRoot}>
    <main className={styles.layoutContent}>{children}</main>
  </div>
);
