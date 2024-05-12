import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartItem } from "./cartItem.entity";
import { CreateCartItemDto } from "./dto/createCartItem.dto";

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async createOne(
    createCartItemDto: CreateCartItemDto,
    userId: number,
    productId: number,
  ) {
    const existingCartItem = await this.cartItemRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        product: {
          id: productId,
        },
      },
    });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      return await this.cartItemRepository.save(existingCartItem);
    } else {
      const newCartItem = {
        title: createCartItemDto.title,
        quantity: 1,
        size: createCartItemDto.size,
        price: createCartItemDto.price,
        user: { id: userId },
        product: { id: productId },
      };

      return await this.cartItemRepository.save(newCartItem);
    }
  }

  async getAllCartItems(userId: number) {
    return await this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: {
        product: true,
      },
    });
  }
}
