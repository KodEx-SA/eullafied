import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security headers
  app.use(helmet());

  // CORS — allow frontend dev server + production URL
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3001',
      'https://eullafied.vercel.app', // update to your prod URL later
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Strip password/refreshToken from all responses automatically
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📋 Auth endpoints: http://localhost:${port}/${apiPrefix}/auth`);
}
bootstrap();
