import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartItemService } from "@entities/cartItem/cartItem.service";

@Controller("cart")
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
  ) {}

  @Post("/add")
  @HttpCode(HttpStatus.CREATED)
  async addToCart(@Body() body: { productId: number }) {
    const { productId } = body;
    const cart = await this.cartService.getUserCart(productId);

    const itemData = {
      name: "sdsd",
      price: 32,
      quantity: 45,
      size: "35",
      cart,
    };

    await this.cartItemService.createOne(itemData);
    await this.cartService.addItem(productId, itemData);

    return { status: "ok" };
  }
}
