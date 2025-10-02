import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductTypesModule } from './modules/product-types/product-types.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env'], // prioriza prod, luego .env
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BD_HOST,
      port: Number(process.env.BD_PORT),
      username: process.env.BD_USER,
      password: process.env.BD_PASSWORD,
      database: process.env.BD_DATABASENAME,
      autoLoadEntities: true,
      synchronize: false, // true solo en desarrollo   
      ssl: { rejectUnauthorized: false },   
    }),

    CategoriesModule,

    ProductTypesModule,

    ProductsModule


  ],
  controllers: [],
  providers: [],
})
export class AppModule {


}
