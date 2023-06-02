import Repository from "./Repository";
import { GetGameByIDResponseDTO } from "@/shared/DTO/get-game-by-id.response.dto";
import { GetGamesByUserIDDTO } from "@/shared/DTO/get-games-by-user-id.dto";
import { GetGamesByUserIDResponseDTO } from "@/shared/DTO/get-games-by-user-id.response.dto";
const resource = "/game";
export default {
  getGameByID(gameID: number) {
    return Repository.get<GetGameByIDResponseDTO>(`${resource}/${gameID}`);
  },
  getGamesByUserIDDTO(dto: GetGamesByUserIDDTO) {
    return Repository.post<GetGamesByUserIDResponseDTO>(
      `${resource}/by-user-id`,
      dto
    );
  },
};
