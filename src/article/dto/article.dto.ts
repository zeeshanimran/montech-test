import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  data: string;

  @ApiPropertyOptional()
  isPublished: boolean;

  @ApiProperty()
  status: string;
}
