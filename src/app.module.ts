import { Module } from "@nestjs/common";
import { ConfigModule } from "./config.module";
import { TypeOrmModule } from "@database/typeorm.module";
import { ProductModule } from "@entities/product/product.module";

@Module({
  imports: [ConfigModule, TypeOrmModule, ProductModule],
})
export class AppModule {}
