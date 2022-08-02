import Repository from "./Repository";
import { User } from "../shared/interfaces/user.interface";
import { BuyIconDTO } from "../shared/DTO/buy-icon.dto";
import { SelectIconDTO } from "../shared/DTO/select-icon.dto";
import { ProfileIcon } from "@/shared/icons";

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
  buyIcon(iconName: string) {
    const icon: ProfileIcon = ProfileIcon[iconName];
    const buyIconDTO: BuyIconDTO = { icon };
    return Repository.post(`${resource}/buy-icon`, buyIconDTO);
  },
  selectIcon(iconName: string) {
    const icon: ProfileIcon = ProfileIcon[iconName];
    const selectIconDTO: SelectIconDTO = { icon };
    return Repository.post(`${resource}/select-icon`, selectIconDTO);
  },
};
