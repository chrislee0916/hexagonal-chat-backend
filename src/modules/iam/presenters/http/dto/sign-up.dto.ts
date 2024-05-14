import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: '電子信箱',
    example: 'example@gmail.com',
  })
  @IsString()
  readonly email: string;

  @ApiProperty({
    description: '密碼',
    example: 'password',
  })
  @IsString()
  readonly password: string;

  @ApiProperty({
    description: '確認密碼',
    example: 'password',
  })
  @IsString()
  readonly password_confirmed: string;
}
