import { IsString } from 'class-validator';

export class CheckUsernameDTO {
  @IsString({ message: 'Invalid username' })
  readonly username: string;
}
