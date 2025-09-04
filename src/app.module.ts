import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductTypesModule } from './modules/product-types/product-types.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.BD_SECUNDARIA_HOST,
      port: Number(process.env.BD_SECUNDARIA_PUERTO),
      username: process.env.BD_SECUNDARIA_USUARIO,
      password: process.env.BD_SECUNDARIA_CONTRASENA,
      database: process.env.BD_SECUNDARIA_NAME,
      autoLoadEntities: true,
      synchronize: false, // true solo en desarrollo
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
