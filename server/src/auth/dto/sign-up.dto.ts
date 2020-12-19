import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsAlphanumeric,
} from 'class-validator';
import { Match } from '../../validate-decorators/match.decorator';

export class SignUpDTO {
  @IsAlphanumeric('en-US', {
    message: "Username can't contain special characters",
  })
  @MinLength(3, { message: 'Username is too short (3-20 characters)' })
  @MaxLength(20, { message: 'Username is too long (3-20 characters)' })
  readonly username: string;

  @IsEmail({}, { message: 'Invalid email' })
  @MaxLength(40, { message: 'Invalid email' })
  readonly email: string;

  @IsString()
  @MinLength(4, { message: 'Password is too short' })
  @MaxLength(40, { message: 'Password is too long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  readonly password: string;

  @Match('password', { message: "Passwords don't match" })
  readonly passwordConfirm: string;
}
