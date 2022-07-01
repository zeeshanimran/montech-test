import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ForbiddenRequestDto } from '../errorSchemas/forbidden.dto';
import { UnauthorizedRequestDto } from '../errorSchemas/unauthorized.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserRole } from '../user/entities/user.entity';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleStatusDto } from './dto/update-article-status.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
@ApiTags('Articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(UserRole.AUTHOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create an article',
    description:
      'Use this API to create an article. Only an Author can create an article.',
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
    type: ArticleDto,
    status: 201,
    description: 'Returns newly created article.',
  })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch all article in an array',
    description:
      'Use this API to fetch all article. Note that an author can fetch all articles but an editor can fetch only published articles that are pending approval.',
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
    description: 'Returns array of article.',
    type: ArticleDto,
    isArray: true,
  })
  findAll(@Req() req) {
    return this.articleService.findAll(req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(UserRole.AUTHOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an article',
    description:
      'Use this API to update an article. Only an Author can update an article. Updating and approved or rejected article with change its status to pending again so it can get reviewed by editor again.',
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
    type: ArticleDto,
    status: 200,
    description: 'Returns updated article.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Patch('updateStatus/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(UserRole.EDITOR)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an article status',
    description: `Use this to update an article's status. Only an editor can update the status of an article`,
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
    type: ArticleDto,
    status: 200,
    description: 'Returns updated article.',
  })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArticleStatusDto: UpdateArticleStatusDto,
  ) {
    return this.articleService.updateStatus(id, updateArticleStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(UserRole.AUTHOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an article',
    description: `Use this API to delete an article. Only an author can delete an article`,
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
    description: 'message: This article is deleted successfully',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.articleService.remove(id);
  }
}
