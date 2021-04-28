import { IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from 'src/validate-decorators/match.decorator';

export class PasswordChangeDTO {
  @IsString()
  @MinLength(4, { message: 'Password is too short' })
  @MaxLength(40, { message: 'Password is too long' })
  readonly oldPassword: string;

  @IsString()
  @MinLength(4, { message: 'Password is too short' })
  @MaxLength(40, { message: 'Password is too long' })
  readonly password: string;

  @Match('password', { message: "Passwords don't match" })
  readonly passwordConfirm: string;
}
