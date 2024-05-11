import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "@services/auth/auth.module";
import { CartModule } from "@entities/cart/cart.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, CartModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
