import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── HELMET — headers de segurança HTTP ──────────────────────────────────
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // ── COOKIE PARSER ────────────────────────────────────────────────────────
  app.use(cookieParser());

  // ── CORS — apenas o frontend do Railway pode chamar a API ────────────────
  app.enableCors({
    origin: [
      'https://mynf-production-f5e4.up.railway.app',
      'http://localhost:3000', // desenvolvimento local
    ],
    credentials: true,         // necessário para cookies httpOnly
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ── VALIDAÇÃO GLOBAL DE INPUTS ───────────────────────────────────────────
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // remove campos não declarados no DTO
    forbidNonWhitelisted: true,// retorna erro se vier campo extra
    transform: true,           // converte tipos automaticamente
  }));

  // ── PREFIXO GLOBAL DA API ────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 myNF Backend rodando na porta ${port}`);
  console.log(`🛡️  Helmet, CORS e Rate Limiting ativos`);
}

bootstrap();