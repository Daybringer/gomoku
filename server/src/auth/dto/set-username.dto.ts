import {
  IsAlphanumeric,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class SetUsernameDTO {
  @IsAlphanumeric('en-US', {
    message: "Username can't contain special characters",
  })
  @MinLength(3, { message: 'Username is too short (3-20 characters)' })
  @MaxLength(20, { message: 'Username is too long (3-20 characters)' })
  readonly username: string;

  @IsString({ message: 'Invalid token' })
  readonly id_token: string;
}
