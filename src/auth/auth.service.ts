

import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt.payload.interface';

//import { AuthController } from './auth.controller';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
    
    if(!bcrypt.compareSync( password, user.password) )
      throw new UnauthorizedException('Not valid Credentials (password)');

    return{
      ...user,
      token: this.getJwtToken({ email: user.email })
    };

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

      return{
        ...user,
        token: this.getJwtToken({ email: user.email })
      };
    }
    catch( error )
    {
      this.handleDBError(error);
      //console.log(error);
    }    
  }
  //#endregion

//#region Private functions --------------------------

//#region getJwtToken
private getJwtToken( payload: JwtPayload )
{
  const token = this.jwtService.sign(payload);
  return token;
}
//#endregion

 //#region handleDBError
private handleDBError( error: any): never {   //este metodo no regeresa un valor cuando se usa : never
  if( error.code === '23505')
  {
    throw new BadRequestException(`Se ha producido el siguiente error: ${ error.detail }`)
  }
  console.log(error);
  throw new InternalServerErrorException('Por favor revise el server log');
}
//#endregion

//#endregion ------------------------------

}
