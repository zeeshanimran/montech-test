import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { BadRequestDto } from '../errorSchemas/bad-request.dto';
import { UnauthorizedRequestDto } from '../errorSchemas/unauthorized.dto';
import { ForbiddenRequestDto } from '../errorSchemas/forbidden.dto';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Validate email and password for user login',
    description:
      'Validate email and password to get auth token. Put this token in top right Authorize section.',
  })
  @ApiBody({
    description: 'You can add custom inputs replacing default.',
    type: UserLoginDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedRequestDto,
    description: 'UnauthorizedException',
  })
  @ApiResponse({
    type: LoginResponseDto,
    status: 201,
    description: 'Returns the user with auth token',
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post()
  @ApiOperation({
    summary: 'Register a user',
    description: `You can register a user here. Please choose "editor" or "author" for specific role.`,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
    description: 'BadRequestException',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns newly created user',
    type: UserDto,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User | any> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch all users',
    description: `This API will return all users in an array.`,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedRequestDto,
    description: 'UnauthorizedException',
  })
  @ApiForbiddenResponse({
    type: ForbiddenRequestDto,
    description: 'ForbiddenException',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns array of users',
    type: UserDto,
    isArray: true,
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find a user',
    description: `This API will return 1 user matching the param id.`,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedRequestDto,
    description: 'UnauthorizedException',
  })
  @ApiForbiddenResponse({
    type: ForbiddenRequestDto,
    description: 'ForbiddenException',
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
    description: 'BadRequestException',
  })
  @ApiResponse({
    type: UserDto,
    status: 200,
    description: 'Returns a user',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserById(id);
  }
}
