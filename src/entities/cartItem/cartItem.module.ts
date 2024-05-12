import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItem } from "./cartItem.entity";
import { CartItemService } from "./cartItem.service";
import { Product } from "@entities/product/product.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
