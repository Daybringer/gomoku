import { FilledGame } from "@/shared/interfaces/game.interface";
import { EndingType, GameType } from "@/shared/types";

const exampleGame1: FilledGame = {
  id: 0,
  turnHistory: [],
  typeOfWin: EndingType.Surrender,
  type: GameType.Quick,
  winnerGameProfileID: 0,
  finalState: [[]],
  playerGameProfilesIDs: [0, 1],
  startingPlayerGameProfileID: 0,
  // extra
  me: { delta: 0, id: 1, remainingTime: 119, username: "Daybringer" },
  opponent: {
    delta: 0,
    id: 2,
    remainingTime: 112,
    username: "",
    logged: false,
  },
  win: true,
  dateString: "2022-07-04 21:09:38.452",
};

export { exampleGame1 };
