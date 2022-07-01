import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Current political situation',
    description: 'Title of the article',
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    example: `A significant disadvantage of soft deletes is that we always need to keep them in mind when performing various queries. If we use Object-Relational Mapping such as TypeORM, it makes our work a bit easier. However, we still need to be aware of the additional effort PostgreSQL needs to make to filter out records where is_deleted equals true.
    Even if we expect is_deleted to be false in most of our queries, this might not always be the case. A significant advantage of the soft deletes is the fact that we can still fetch the deleted records. This might come in handy when we want to generate some report, for example. Thanks to soft deletes, we can include all of the records.`,
    description: 'Data of the article',
  })
  data: string;

  @IsOptional()
  @ApiPropertyOptional({ example: true, description: 'Publish the article' })
  isPublished: boolean;
}
