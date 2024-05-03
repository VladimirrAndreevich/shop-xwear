import { Module } from "@nestjs/common";
import { RedisModule as NestRedisModule } from "@svtslv/nestjs-ioredis";

import { RedisService } from "./redis.service";

@Module({
  imports: [
    NestRedisModule.forRoot({
      config: {
        host: String(process.env.REDIS_HOST),
        port: Number(process.env.REDIS_PORT),
        password: String(process.env.REDIS_PASSWORD),
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
