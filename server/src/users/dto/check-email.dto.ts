import { IsString } from 'class-validator';

export class CheckEmailDTO {
  @IsString({ message: 'Invalid email' })
  readonly email: string;
}
