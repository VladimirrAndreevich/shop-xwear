import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "@services/auth/auth.module";
import { CartItemModule } from "@entities/cartItem/cartItem.module";
import { ProductModule } from "@entities/product/product.module";
import { CartItem } from "@entities/cartItem/cartItem.entity";
import { RedisModule } from "@services/redis/redis.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([CartItem]),
    AuthModule,
    CartItemModule,
    ProductModule,
    RedisModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
