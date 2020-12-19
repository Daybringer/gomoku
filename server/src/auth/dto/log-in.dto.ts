import { IsNotEmpty, IsString } from 'class-validator';

export class LogInDTO {
  @IsString({ message: 'Invalid username' })
  readonly usernameOrEmail: string;

  @IsNotEmpty({ message: 'Invalid password' })
  readonly password: string;
}
