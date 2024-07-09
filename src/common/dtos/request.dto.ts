import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class DefaultListQueryDto {
  @ApiProperty({
    required: false,
    description: '數量',
    example: '25',
  })
  @Type(() => Number)
  @IsNumber()
  limit: number;

  @ApiProperty({
    required: false,
    description: '跳過數量',
    example: '0',
  })
  @Type(() => Number)
  @IsNumber()
  skip: number;

  @ApiProperty({
    required: false,
    description: '排序',
    example: '-createdAt',
  })
  @IsString()
  sort: string;
}
