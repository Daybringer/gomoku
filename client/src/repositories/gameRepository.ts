
import { GetGameByIDResponseDTO } from "@/shared/DTO/get-game-by-id.response.dto";
import Repository from "./Repository";
const resource = "/game";
export default {
    getGameByID(gameID: number) {
        return Repository.get<GetGameByIDResponseDTO>(`${resource}/${gameID}`)
    }
}