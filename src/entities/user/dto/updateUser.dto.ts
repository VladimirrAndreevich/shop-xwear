import { IsEmail, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  nameFirst: string;

  @IsString()
  @MinLength(1)
  login: string;
}
