import { IsString } from 'class-validator';

export class GoogleSignInDTO {
  @IsString({ message: 'Invalid token' })
  readonly id_token: string;
}
