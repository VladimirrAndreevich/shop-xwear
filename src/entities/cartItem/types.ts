import { Cart } from "@entities/cart/cart.entity";

export type AddCartItem = {
  name: string;
  price: number;
  quantity: number;
  size: string;
  cart: Cart;
};
