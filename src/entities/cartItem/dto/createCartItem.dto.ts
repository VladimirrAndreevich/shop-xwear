import { IsNotEmpty } from "class-validator";

export class CreateCartItemDto {
  @IsNotEmpty()
  size: string;
}
