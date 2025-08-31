/**
 * Returns either 1 or -1 with 50/50 probability.
 */
export function getRandomSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}
