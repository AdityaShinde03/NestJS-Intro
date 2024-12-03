import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(96)
    firstName: string

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(96)
    lastName?:string

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(96)
    email:string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(96)
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{
        message:'Minimum 8 characters long, at least one lowercase, at least one uppercase, at least one digit, at least one special character'
    })
    password:string
}