# Ping Pong (React + TypeScript)

Simple ping-pong game using React + TypeScript

## Scripts

- `yarn dev` - start dev server
- `yarn build` - production build
- `yarn preview` - preview built app

## Getting Started

```
nvm use 22.19.0
yarn install
yarn dev
```

Open http://localhost:5173

## Notes

1. Started with a clean project init
2. Added a game component which contained a layout and the main game logic.
    - I wasn't sure whether to make a single-player game with AI, or a multi-player game.
    - Decided to go with a single player game, but it could easily be extended to multi-player if needed.
3. Added a layout
    - I decided to move ahead with preconfigured dimensions, but explored the option to add dynamic resizing, which should be possible, but would add additional complexity to the calculations.
    - I decided to use css modules as a very simple solution for this project.
4. Added a paddle
    - I explored the possibility to move the paddle with the mouse, which worked pretty nice, but I decided to use keyboard shortcuts to make it a fair multi-player game.
    - I started by adding the logic to move paddles on requestAnimationFrame, but in order to improve perf, paddles could be added to ball physics (this file was added later) to avoid an additional call to requestAnimationFrame
    - After adding a second paddle (right one) I started thinking that it would be great to have an AI integration so that it's easier to validate my changes locally.
5. Added a ball
    - Ball physics can get complex, I had to do a lot of searching to figure out the best algorithm.
    - Passing the information about the ball position is tricky, expecially due to all the collisions with other moving parts.
    - I decided to solve the communication with the paddles using a ref to the Paddle and exposing an ImperativeHandle. I am not a big fan of this solution but it help with decoupling the logic between the ball and paddles.
    - Probably the best solution would be to move the Paddle movement logic to the same place where we handle ball physics, to have a single requestAnimationFrame call, especially for collisions.
6. Added traces
    - Ideally, traces could be added to ball physics to avoid an additional call to requestAnimationFrame, but I wanted to keep them separately.
7. Added the scoring logic
    - In the scoreboard, I was hitting an issue with animations and had to apply a workaround. If I would have more time, I would look into removing the workaround.
8. Added Lint and Prettier
    - Code kept growing so I needed to keep it under control.
9. Added leaderboard
    - I realized that I need to add logic to start the match, there was no concept of a match so far, but we needed a match so that there is something I can store in the leaderboard.
    - Leaderboard can potentially be a separate screen, because it's taking quite a lot of space.
    - We could add a player's name to leaderboard if they have a high score.
10. Added difficulty
    - Had to refactor the way the start game screen was implemented to add difficulty there.
    - Very simple implementation so far -> ball moves faster.
    - Had and idea to increase the ball speed on every touch.
11. Code kept growing, did a bit of refactoring
    - Changed the project structure a bit.
12. Moved leaderboard to a separate screen
    - Got more real-estate on the main game screen.
    - Had to introduce a new layer -> App -> which now has 2 screens: game and leaderboard.
13. Added an option to input name before being added to the leaderboard
    - Doesn't seem important, but it's a nice feature.
14. Added tests
    - Tested core ball moving logic, and match logic.
    - Testing could be easily expanded/improved.
