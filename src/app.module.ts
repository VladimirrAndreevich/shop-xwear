import { Module } from "@nestjs/common";
import { ConfigModule } from "./config.module";
import { TypeOrmModule } from "@database/typeorm.module";
import { ProductModule } from "@entities/product/product.module";
import { UserModule } from "@entities/user/user.module";
import { AdminModule } from "@entities/admin/admin.module";
import { RoleModule } from "@entities/role/role.module";
import { CartItemModule } from "@entities/cartItem/cartItem.module";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule,
    AdminModule,
    RoleModule,

    CartItemModule,
    UserModule,
    ProductModule,
  ],
})
export class AppModule {}
