import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CustomersModule } from './modules/customers/customers.module';
import { SalesModule } from './modules/sales/sales.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('BD_HOST'),
        port: +configService.get('BD_PORT'),
        username: configService.get('BD_USER'),
        password: configService.get('BD_PASSWORD'),
        database: configService.get('BD_DATABASENAME'),
        autoLoadEntities: true,
        synchronize: true, // true only for local development
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    InventoryModule,
    CustomersModule,
    SalesModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

