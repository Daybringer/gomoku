
import { ProfileIcon } from "@/shared/icons";
import { User } from "@/shared/interfaces/user.interface";
import { GameBoard, LoginStrategy } from "@/shared/types";
const exampleUser1: User = {
    id: 2,
    achievements: [],
    availableIcons: [],
    credit: 0,
    quickLost: 0,
    quickWon: 0,
    username: "Klari_testuje",
    quickTied: 0,
    rankedLost: 0,
    rankedWon: 0,
    rankedTied: 0,
    email: "dummyuser@gmail.com",
    admin: false,
    createdAt: new Date(),
    elo: 1001,
    verified: true,
    selectedIcon: ProfileIcon.turtle,
    playerColor: "",
    enemyColor: "",
    gameBoard: GameBoard.Standard,
    strategy: LoginStrategy.Local,
}

export { exampleUser1 }