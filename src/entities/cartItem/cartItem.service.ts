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
      let newPrice = +existingCartItem.price;

      if (existingProduct.priceDiscounted) {
        newPrice = +newPrice - +existingProduct.priceDiscounted;
      } else {
        newPrice = +newPrice - +existingProduct.price;
      }

      existingCartItem.price = newPrice;

      if (existingProduct.priceDiscounted) {
        existingCartItem.discount =
          +existingCartItem.discount -
          (+existingProduct.price - +existingProduct.priceDiscounted);
      }

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
      let newPrice = +existingCartItem.price;
      if (existingProduct.priceDiscounted) {
        newPrice += +existingProduct.priceDiscounted;
      } else {
        newPrice += +existingProduct.price;
      }
      existingCartItem.price = newPrice;

      if (existingCartItem.discount && existingProduct.priceDiscounted) {
        existingCartItem.discount =
          +existingCartItem.discount +
          +existingProduct.price -
          +existingProduct.priceDiscounted;
      } else if (existingProduct.priceDiscounted) {
        existingCartItem.discount =
          +existingProduct.price - +existingProduct.priceDiscounted;
      }

      return await this.cartItemRepository.save(existingCartItem);
    } else {
      const newPrice = existingProduct.priceDiscounted
        ? existingProduct.priceDiscounted
        : existingProduct.price;

      const newDiscount = existingProduct.priceDiscounted
        ? +existingProduct.price - +existingProduct.priceDiscounted
        : null;
      const newCartItem = {
        title: existingProduct.title,
        quantity: 1,
        size: createCartItemDto.size,
        price: newPrice,
        user: { id: userId },
        product: { id: productId },
        discount: newDiscount,
      };

      return await this.cartItemRepository.save(newCartItem);
    }
  }

  async getAllCartItems(userId: number) {
    return await this.cartItemRepository.find({
      where: { user: { id: userId } },
      order: {
        id: "ASC",
      },
      relations: {
        product: true,
      },
    });
  }

  async getAllCartItemsByOrder(orderId: number) {
    return await this.cartItemRepository.find({
      where: { order: { id: orderId } },
      relations: {
        product: true,
      },
    });
  }

  async transferToOrder(userId: number, orderId: number) {
    const cart = await this.cartItemRepository.find({
      where: { user: { id: userId } },
    });

    const newCart = cart.map((item) => {
      return { ...item, user: { id: null }, order: { id: orderId } };
    });

    return await this.cartItemRepository.save(newCart);
  }
}
