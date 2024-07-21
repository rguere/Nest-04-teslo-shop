import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { Product } from './products/entities/product.entity';
import { ProductImage } from './products/entities/product-image.entity';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';


@Module({
  imports: [ 
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      entities: [Product, ProductImage],
      synchronize: true, //normalmente se usa en false cuando se esta enb produccion
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), }),

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,
  ],
})
export class AppModule {}
