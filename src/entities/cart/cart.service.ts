import { Injectable } from "@nestjs/common";
import { Cart } from "./cart.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddCartItem } from "@entities/cartItem/types";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async getUserCart(userId: number) {
    return await this.cartRepository.findOne({
      where: {
        userId,
      },
      relations: {
        items: true,
      },
    });
  }

  async addItem(userId: number, item: AddCartItem) {
    try {
      const cart = await this.cartRepository.findOne({
        where: {
          userId,
        },
      });

      await this.cartRepository.update(cart.id, {
        items: [...cart.items, item],
      });
    } catch (error) {
      await this.cartRepository.create({
        items: [item],
        userId,
      });
    }

    return;
  }
}
