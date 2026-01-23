import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductTypesModule } from './modules/product-types/product-types.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductImagesModule } from './modules/product-images/product-images.module';
import { FinanceModule } from './finance/finance.module';
import { SalesNotesModule } from './modules/sales-notes/sales-notes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env'], // prioriza prod, luego .env
    }),

    // Debemos configurar de manera asincrona TypeORM para poder utilizar la funcion de configService
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

        //IMPORTANTE: true solo en desarrollo, si lo activas, reemplaza los cambios que vayas haciendo en las entidades automaticamente, se pueden perder datos importantes.
        synchronize: false,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: false, // false: sirve para no ejecutar la migraciones automaticamente
        logging: configService.get('NODE_ENV') === 'development',

        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),

    CategoriesModule,

    ProductTypesModule,

    ProductsModule,

    ProductImagesModule,

    FinanceModule,
    SalesNotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
