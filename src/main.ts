// Nest
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

// for TypeORM
import "reflect-metadata";

// Modules
import { AppModule } from "./app.module";

// additional
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, "..", "storage"));

  app.enableCors({
    origin: "*",
    allowedHeaders: "*",
    methods: "*",
  });

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
