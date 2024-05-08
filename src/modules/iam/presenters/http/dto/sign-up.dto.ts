import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: '電子信箱',
    example: 'example@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: '密碼',
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: '確認密碼',
    example: 'password',
  })
  @IsString()
  password_confirmed: string;
}
