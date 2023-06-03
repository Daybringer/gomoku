import Repository from "./Repository";
import { GetGameByIDResponseDTO } from "@/shared/DTO/get-game-by-id.response.dto";
import { GetGamesByUserIDDTO } from "@/shared/DTO/get-game-by-user-id.dto";
import { GetGameByUserIDDTOResponse } from "@/shared/DTO/get-game-by-user-id.response.dto";
const resource = "/game";
export default {
  getGameByID(gameID: number) {
    return Repository.get<GetGameByIDResponseDTO>(`${resource}/${gameID}`);
  },
  getGamesByUserIDDTO(dto: GetGamesByUserIDDTO) {
    return Repository.post<GetGameByUserIDDTOResponse>(
      `${resource}/by-user-id`,
      dto
    );
  },
};
