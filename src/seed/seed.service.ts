import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { Product } from '../products/entities/product.entity';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {
  constructor(
    private readonly producstService: ProductsService
  ){}

  async runSeed() {
    await this.insertNewProducts();
    return 'Executed Seed...';
   }

   private async insertNewProducts() {
    await this.producstService.deleteAllProduct();
    const products = initialData.products;
    const insertPromise = [];
    
   // products.forEach( product => {
   //   insertPromise.push( this.producstService.create( product) );
   // })

    await Promise.all( insertPromise );
    return true;
   }
}
