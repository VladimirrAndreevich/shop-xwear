import { IsNotEmpty } from "class-validator";
// import { E_OrderStatus } from "../order.enum";
// import { CartItem } from "@entities/cartItem/cartItem.entity";
// import { User } from "@entities/user/user.entity";

export class CreateOrderDto {
  @IsNotEmpty()
  nameFirst: string;

  @IsNotEmpty()
  nameSecond: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  postalCode: number;

  @IsNotEmpty()
  phoneNumber: number;

  // @IsNotEmpty()
  // status: E_OrderStatus;

  // @IsNotEmpty()
  // cart: CartItem[];

  // @IsNotEmpty()
  // user: User;
}
