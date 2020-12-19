import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
  @IsNotEmpty({ message: 'The refresh token is required' })
  readonly refreshToken: string;
}
