// Nest Core
import { NestFactory } from "@nestjs/core";

// for TypeORM
import "reflect-metadata";

// Modules
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
