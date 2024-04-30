// Nest Core
import { NestFactory } from "@nestjs/core";

// for TypeORM
import "reflect-metadata";

// Modules
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: "*",
    allowedHeaders: "*",
    methods: "*",
  });

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
