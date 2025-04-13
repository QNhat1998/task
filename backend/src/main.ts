import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình CORS
  app.enableCors({
    origin: true, // Cho phép tất cả origin
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  });

  // Sử dụng cookie-parser
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  const config = new DocumentBuilder().setTitle("Task Manager API").setDescription("The Task Manager API description").setVersion("1.0").addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT || 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
