import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCartItemDto {
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  size: string;
}
