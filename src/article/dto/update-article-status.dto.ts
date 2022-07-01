import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';

export class UpdateArticleStatusDto {
  @IsNotEmpty()
  @IsEnum(ArticleStatus)
  @ApiProperty({
    example: 'approved',
    description: `New status of article. accepts 'pending', 'approved', 'rejected'`,
  })
  status: ArticleStatus;
}
