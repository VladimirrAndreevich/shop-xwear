import { Module } from "@nestjs/common";
import { ConfigModule } from "./config.module";
import { TypeOrmModule } from "@database/typeorm.module";
import { ProductModule } from "@entities/product/product.module";
import { UserModule } from "@entities/user/user.module";

@Module({
  imports: [ConfigModule, TypeOrmModule, UserModule, ProductModule],
})
export class AppModule {}
