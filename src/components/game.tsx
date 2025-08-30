import type { FC } from 'react';
import { Layout } from './layout';
import { Paddle } from './paddle';

export const Game: FC = () => (
  <Layout>
    <Paddle side="left" ariaLabel="left player paddle" />
    <Paddle side="right" ariaLabel="right player paddle" keyMapping={{ up: ['i','I'], down: ['k','K'] }} />
  </Layout>
);
