import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthController } from './auth.controller';
import { LoginUserDto,CreateUserDto } from './dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}
  

  //#region login
  async login(loginUserDto: LoginUserDto)
  {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: {email:true, password:true }
    });

    if ( !user )
    {
      throw new UnauthorizedException('Not valid credentials (email)');
    }
    
    if(!bcrypt.compareSync( password, user.password))
      throw new UnauthorizedException('Not valid Credentials (password)');

    return user;
    //TODO: retornnar el JWT
  }
 //#endregion



  //#region  Crear usuario
  async create(createUserDto: CreateUserDto) {
    try{
      const {password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
    });

      await this.userRepository.save(user);
      delete user.password;
      return user;
      //TODO: Retornar el JWT de acceso
    }
    catch( error )
    {
      this.handleDBError(error);
      //console.log(error);
    }    
  }
  //#endregion

//#region Private functions

private handleDBError( error: any): never {   //este metodo no regeresa un valor cuando se usa : never
  if( error.code === '23505')
  {
    throw new BadRequestException(`Se ha producido el siguiente error: ${ error.detail }`)
  }
  console.log(error);
  throw new InternalServerErrorException('Por favor revise el server log');
}
//#endregion

}
