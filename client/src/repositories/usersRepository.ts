import Repository from "./Repository";
import { User } from "../shared/interfaces/user.interface";
import { BuyIconDTO } from "../shared/DTO/buy-icon.dto";
import { SelectIconDTO } from "../shared/DTO/select-icon.dto";
import { SetGameboardDTO } from "../shared/DTO/set-gameboard.dto";
import { SetColorsDTO } from "../shared/DTO/set-colors.dto";
import { ProfileIcon } from "@/shared/icons";
import { GameBoard } from "@/shared/types";

const resource = "/users";
export default {
  userWithMailExists(email: string) {
    return Repository.post(`${resource}/check-email`, { email });
  },
  userWithUsernameExists(username: string) {
    return Repository.post(`${resource}/check-username`, { username });
  },
  // getUserProfile() {},
  getOwnUserProfile() {
    return Repository.get<User>(`${resource}/profile`);
  },
  getRandomName() {
    return Repository.post(`${resource}/generate-name`);
  },
  changeUsername(username: string) {
    return Repository.post(`${resource}/change-username`, { username });
  },
  buyIcon(profileIcon: ProfileIcon) {
    const buyIconDTO: BuyIconDTO = { icon: profileIcon };
    return Repository.post(`${resource}/buy-icon`, buyIconDTO);
  },
  selectIcon(profileIcon: ProfileIcon) {
    const selectIconDTO: SelectIconDTO = { icon: profileIcon };
    return Repository.post(`${resource}/select-icon`, selectIconDTO);
  },
  setGameboard(gameboard: GameBoard) {
    const setGameboardDTO: SetGameboardDTO = { gameboard };
    return Repository.post(`${resource}/set-gameboard`, setGameboardDTO);
  },
  setColors(myColor: string, enemyColor: string) {
    const setColorsDTO: SetColorsDTO = { enemyColor, myColor };
    return Repository.post(`${resource}/set-colors`, setColorsDTO);
  },
};
