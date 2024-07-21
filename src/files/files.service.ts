import { BadRequestException, Injectable } from '@nestjs/common';
import { error } from 'console';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {


    getStaticProductImage( imageName: string )
    {
        const path = join( __dirname, '../../static/products', imageName );

        console.log(path);
        
        if( !existsSync(path) )
        {
            throw new BadRequestException(`No se ha encontrado el archivo..${ imageName }`);
        }
        return path;
    }
}
