import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator"

export class CreateTagDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(256) 
    name:string

    @ApiProperty({
        description: "For Eamxple: 'my-url'",
        example: 'my-blog-post',
      })
      @IsString()
      @IsNotEmpty()
      @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "A slug should be all small letters and use only '-' and without spaces. For Example 'my-url'",
      })
      @MaxLength(512)
    slug:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsJSON()
    schema: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    @MaxLength(1024)
    featuredImageUrl: string
}