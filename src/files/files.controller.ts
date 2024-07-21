import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, BadRequestException,Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Product } from 'src/products/entities';



@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

//#region findProductImage
@Get('product/:imageName')
findProductImage(
   @Res() res: Response, 
   @Param('imageName') imageName: string 
  )
  {
    const path = this.filesService.getStaticProductImage( imageName );
    res.sendFile( path );
  }

//#endregion

  //#region  uploadProductImage
  @Post('product')
  @UseInterceptors( FileInterceptor('file',{fileFilter:fileFilter,storage: diskStorage({
    destination: './static/products',
    filename: fileNamer
  })}) )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File ){
    //no es nada recomendable colocar las imagenes en el file system, pues se 
    //presta a que maliciosamente pongan info en donde esta el codigo

    if( !file ) {
      throw new BadRequestException('Asegurese de subir un archivo de imagen');
    }  

    //const secureUrl = `${ file.filename }`; --asi se optiene toda la ruta
    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;
    return {
      //fileName: file.originalname
      secureUrl
    }
  }

  //#endregion

}
