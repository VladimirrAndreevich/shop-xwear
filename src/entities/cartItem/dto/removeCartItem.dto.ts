import { IsNotEmpty } from "class-validator";

export class RemoveCartItemDto {
  @IsNotEmpty()
  size: string;
}
