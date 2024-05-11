import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItem } from "./cartItem.entity";
import { CartItemService } from "./cartItem.service";

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  controllers: [],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
