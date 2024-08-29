import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
   ( data: string, contx: ExecutionContext )  => {
    const req = contx.switchToHttp().getRequest();
    const user = req.user;

    if( !user )
        throw new InternalServerErrorException('User not found -request-');

    return ( !data ) ? user : user[data]; // si no existe la data devuelve user sino userData
   });