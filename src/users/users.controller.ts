import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamsDto } from './dtos/get-user-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags("Users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/:id?')
  @ApiOperation({
    summary: "This API fetches the list of register users on the application.",
  })
  @ApiResponse({
    status: 200,
    description: "Users fetched successfully based on the query"
  })
  @ApiQuery({
    name: "limit",
    type:"number",
    required:false,
    description: "The number of entries returned per query.",
    example:10,
  })
  @ApiQuery({
    name: "page",
    type:"number",
    required:false,
    description: "The position of the page number that you want API to return",
    example:1,
  })
  public getUsers(
    @Param() getUsersParamsDto: GetUserParamsDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {    
    return this.userService.findAllUsers(getUsersParamsDto,limit,page)
  }

  @Post()
  public postUsers(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
