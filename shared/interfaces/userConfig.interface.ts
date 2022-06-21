import { Colors, GameBoard } from "../types";

export interface UserConfig {
  id: number;
  colors: Colors;
  gameBoard: GameBoard;
  SelectedIconID: number;
  availableIconIDs: number[];
  selectedSocialBladeSkinID: number;
  availableSocialBladeSkinIDs: number[];
}
