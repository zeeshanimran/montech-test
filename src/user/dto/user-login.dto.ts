import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'employee@montech.com',
    description: 'Email of the registered user',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: `123456789`,
    description: 'Password of the registered user',
  })
  password: string;
}
