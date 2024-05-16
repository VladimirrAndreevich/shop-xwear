import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartItem } from "./cartItem.entity";
import { CreateCartItemDto } from "./dto/createCartItem.dto";
import { Product } from "@entities/product/product.entity";
import { RemoveCartItemDto } from "./dto/removeCartItem.dto";

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async removeOne(
    removeCartItemDto: RemoveCartItemDto,
    userId: number,
    productId: number,
  ) {
    const existingProduct = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!existingProduct) {
      throw new NotFoundException("Product not found");
    }

    const existingCartItem = await this.cartItemRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        product: {
          id: productId,
        },
        size: removeCartItemDto.size,
      },
    });
    if (existingCartItem && existingCartItem.quantity !== 1) {
      existingCartItem.quantity -= 1;
      const newPrice = +existingCartItem.price - +existingProduct.price;
      existingCartItem.price = newPrice;
      return await this.cartItemRepository.save(existingCartItem);
    } else if (existingCartItem && existingCartItem.quantity === 1) {
      return await this.cartItemRepository.remove(existingCartItem);
    } else {
      throw new NotFoundException("Cart Item not found");
    }
  }

  async createOne(
    createCartItemDto: CreateCartItemDto,
    userId: number,
    productId: number,
  ) {
    const existingProduct = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!existingProduct) {
      throw new NotFoundException("Product not found");
    }

    const existingCartItem = await this.cartItemRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        product: {
          id: productId,
        },
        size: createCartItemDto.size,
      },
    });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      const newPrice = +existingCartItem.price + +existingProduct.price;
      existingCartItem.price = newPrice;
      return await this.cartItemRepository.save(existingCartItem);
    } else {
      const newCartItem = {
        title: existingProduct.title,
        quantity: 1,
        size: createCartItemDto.size,
        price: existingProduct.price,
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
