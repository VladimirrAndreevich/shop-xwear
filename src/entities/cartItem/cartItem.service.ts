import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartItem } from "./cartItem.entity";
import { AddCartItem } from "./types";

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async createOne(itemData: AddCartItem) {
    const newItem = this.cartItemRepository.create({
      ...itemData,
    });
    return await this.cartItemRepository.save(newItem);
  }
}
