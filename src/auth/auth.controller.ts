import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto} from './dto'
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto ) {
    return this.authService.create(createUserDto);
  }  

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }  


//#region  private
  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute( 
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
  )
  {
   console.log( request );
    return {
      ok: true,
      message: 'Que tal, estoy en Private',
      user,
      userEmail,
      rawHeaders,
    }
  }

  //#endregion
  
//#region private 2 
  @Get('private2')
  //@SetMetadata('roles', ['admin','super-user'])
  @RoleProtected( ValidRoles.superUser, ValidRoles.user )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2( 
    @GetUser() user: User
  ){
    return {
      ok: true,
      user,
    }
  }
  //#endregion
  
//#region  private3
  @Get('private3')
  @Auth( ValidRoles.admin)
  privateRoute3( 
    @GetUser() user: User
  ){
    return {
      ok: true,
      user,
    }
  }
  //#endregion

}