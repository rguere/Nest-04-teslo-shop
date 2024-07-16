import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file.filter.helper';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file',{fileFilter:fileFilter}) )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File ){
    //no es nada recomendable colocar las imagenes en el file system, pues s epresta a que maliciosamente pongan info en donde esta el codigo

    if( !file ) {
      throw new BadRequestException('Asegurese de subir un archivo de imagen');
    }  
    return {
      fileName: file.originalname
    }
  }
}
