import type { FC } from 'react';
import { Layout } from './layout';
import { Paddle } from './paddle';

export const Game: FC = () => (
  <Layout>
    <Paddle />
  </Layout>
);
