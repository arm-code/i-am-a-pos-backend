// src/seeds/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('BD_HOST'),
        port: +configService.get('BD_PORT'),
        username: configService.get('BD_USER'),
        password: configService.get('BD_PASSWORD'),
        database: configService.get('BD_DATABASENAME'),
        synchronize: false,
        logging: true,
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}