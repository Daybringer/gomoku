// Enums must be string type in order to check for them in sane way in vue html code
// FIXME implement enums to eq. checks in vue html (GameBase.vue)

enum GameState {
  Waiting = "waiting",
  Coinflip = "coinflip",
  Running = "running",
  Ended = "ended",
}

enum Ending {
  None = "none",
  VictoryFiveInRow = "victoryFiveInRow",
  VictoryTimeout = "victoryTimeout",
  // Opposing player has disconnected and you have won
  VictoryDisconnect = "victoryDisconnect",
  DefeatFiveInRow = "defeatFiveInRow",
  DefeatTimeout = "defeatTimeout",
  // You have been disconnected and lost
  DefeatDisconnect = "defeatDisconnect",
  Tie = "tie",
}

export { GameState, Ending };
