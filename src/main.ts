import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  const config = new DocumentBuilder()
  .setTitle('I AM A POS')
  .setDescription('BACKEND OF MY POS')
  .setVersion('1.0')  
  .build();

  const document = SwaggerModule.createDocument( app, config );
  SwaggerModule.setup( 'api', app, document )


  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
