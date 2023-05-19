import { ProfileIcon } from "@/shared/icons";
import { ExpandedGame } from "@/shared/interfaces/game.interface";
import { EndingType, GameType } from "@/shared/types";

const exampleGame1: ExpandedGame = {
  id: 0,
  createdAt: new Date(),
  turnHistory: [],
  typeOfWin: EndingType.Surrender,
  type: GameType.Quick,
  winnerGameProfileID: 0,
  finalState: [[]],
  playerGameProfilesIDs: [0, 1],
  startingPlayerGameProfileID: 0,
  me: {
    delta: 0,
    id: 1,
    remainingTime: 119,
    username: "Daybringer",
    profileIcon: ProfileIcon.defaultBoy,
  },
  opponent: {
    delta: 0,
    id: 2,
    remainingTime: 112,
    username: "",
    logged: false,
    profileIcon: ProfileIcon.defaultBoy,
  },
  win: true,
  dateString: "2022-07-04 21:09:38.452",
};


export { exampleGame1 };
