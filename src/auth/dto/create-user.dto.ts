import { IsString, MinLength,MaxLength,Matches, IsEmail } from "class-validator";

export class CreateUserDto{
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number' })
    password: string;
	
    @IsString()
    @MinLength(5)
    fullName: string;
}