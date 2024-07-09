import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

//lo puedes hacer asi por el archivo de barril index.ts
import { Product , ProductImage} from './entities';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[
    TypeOrmModule.forFeature([ Product, ProductImage]),
  ],
  exports:[
    ProductsService,
    TypeOrmModule,
  ]
})
export class ProductsModule {}