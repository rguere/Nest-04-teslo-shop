import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {

private readonly logger = new Logger('ProductService');

//#region constructor 
constructor(
  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>,

  @InjectRepository(ProductImage)
  private readonly productImageRepository: Repository<ProductImage>,

  private readonly dataSource: DataSource, //me permite hacer los query runner
){}
//#endregion

//#region create
  async create(createProductDto: CreateProductDto) {
    try{
      const { images = [], ...productDetails } = createProductDto; //...rest es decir el rest de las propeidades

      const product =  this.productRepository.create({
        ...productDetails,  //... obtener todas las propiedad se llama propiedad xpress
        images: images.map( image => this.productImageRepository.create({ url: image }) )
      });

      await this.productRepository.save( product );
      return { ...product,images };
    }
    catch(error){
      this.handleDBExceptions(error);
    }
  }

//#endregion

//#region  findAll
  async findAll( paginationDto: PaginationDto ) {
    try
    {
      const { limit=10, offset=0 } = paginationDto;

      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
         relations:{
            images: true,
         }
      });

      return products.map( product => ({   // esto es la desestructuracion de de argumentos
      ...product, //spreast o express
        images: product.images.map( img => img.url),
      }));
    }
    catch (error)
    {
      this.handleDBExceptions(error);
    }
  }
//#endregion
  
//#region findOne

  async findOne(term: string): Promise<Product> {
    try 
    {
      let product: Product;

      if( isUUID(term) )
        {
          product = await this.productRepository.findOneBy({ id: term});
        }
        else
        {
          const queryBuilder = this.productRepository.createQueryBuilder( 'prod');  //prod es un alias de product
          product = await queryBuilder
          .where('UPPER(title) =:title or slug =:slug', 
            {  
              title: term.toUpperCase(), 
              slug: term.toLowerCase(),
            }).leftJoinAndSelect( 'prod.images', 'prodImages')
              .getOne();
        }

     // const product = await this.productRepository.findOne({ where: { id } });
      if( !product )
        {
          throw new NotFoundException(`El producto con este criterio de busqueda [ ${ term } ] no fue encontrado`);
        }

      return product;
    }
    catch (error)
    {
      this.handleDBExceptions(error);
    }
  }
//#endregion

//#region findOnePlane
  async findOnePlane( term: string) //funcio para aplanar productos
  {
    const { images = [], ...rest } = await this.findOne( term );
    return{
      ...rest,
      images: images.map( image => image.url )
  }
}
//#endregion

//#region  update
  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate} = updateProductDto;

    const product = await this.productRepository.preload( { id, ...toUpdate} );

    if( !product ) throw new NotFoundException(`Product with id ${ id } not found`);

    //create query runner
    const queryRunner =  this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if( images ){
        await queryRunner.manager.delete( ProductImage, { product :{ id } });
        product.images = images.map(
          image => this.productImageRepository.create({ url: image })
        )
      }

      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();
      await queryRunner.release()

      return this.findOnePlane( id );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions( error );
    }    
  }
//#endregion

//#region remove
  async remove(id: string): Promise<void> {
    try 
    {
      const product = await this.productRepository.findOne({ where: { id } });
      if(!product)
        {
          throw new NotFoundException(`El producto con ID [ ${ id }] no fue encontrado revise el ID`);
        }
      await this.productRepository.remove(product);
    }
    catch (error)
    {
      this.handleDBExceptions(error);
    }
  }
//#endregion

//#region  Remove all products -- funcion usada en desarrollo cuaNDO SE UTILIZA LAS SEMILLAS
async deleteAllProduct(){
  const query = this.productRepository.createQueryBuilder('product');
  try{
    return await query
      .delete()
      .where({})
      .execute();
      }
  catch( error)
  {
    this.handleDBExceptions(error);
  }
}
//#region Privates

  private handleDBExceptions( error: any)
  {
    if( error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Se ha producido una excepcion no controlada, revisar el server log');
  
  }
  //#endregion
}
