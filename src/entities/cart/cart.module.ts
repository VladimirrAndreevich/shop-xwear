import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { CartService } from "./cart.service";
import { CartItemModule } from "@entities/cartItem/cartItem.module";
import { CartController } from "./cart.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), CartItemModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
