import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const RawHeaders = createParamDecorator  (
   ( data: string, contx: ExecutionContext )  => {
    const req = contx.switchToHttp().getRequest();
    return req.rawHeaders;
   });