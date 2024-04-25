import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

// For reading environment vars
@Module({
  imports: [NestConfigModule.forRoot()],
})
export class ConfigModule {}
