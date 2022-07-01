import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'Author',
    description: `User's first name`,
  })
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({ example: 'Employee', description: `User's last name` })
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: 'employee@montech.com',
    description: `Users's email`,
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: `Users's role. "author" | "editor"`,
    enum: UserRole,
    example: UserRole.AUTHOR,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    example: '123456789',
    description: `Users's password`,
  })
  @IsNotEmpty()
  password: string;
}
