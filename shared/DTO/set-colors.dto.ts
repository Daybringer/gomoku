import { IsString } from "class-validator";
export class SetColorsDTO {
  @IsString()
  readonly myColor: string;
  @IsString()
  readonly enemyColor: string;
}
