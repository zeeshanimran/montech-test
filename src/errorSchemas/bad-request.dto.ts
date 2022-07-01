import { ApiProperty } from '@nestjs/swagger';

export class BadRequestDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;
}
