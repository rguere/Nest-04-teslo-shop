import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  //#region  Crear usuario
  async create(createUserDto: CreateUserDto) {
    try{
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    }
    catch( error )
    {
      this.handleDBError(error);
      //console.log(error);
    }    
  }
  //#endregion

//#region Private functions

private handleDBError( error: any): never {
  if( error.code === '23505')
  {
    throw new BadRequestException(`Se ha producido el siguiente error: ${ error.detail }`)
  }
  console.log(error);
  throw new InternalServerErrorException('Por favor revise el server loga');
}
//#endregion

}
