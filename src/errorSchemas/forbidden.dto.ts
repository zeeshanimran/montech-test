import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenRequestDto {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;
}
