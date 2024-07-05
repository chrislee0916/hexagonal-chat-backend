import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupChatroomDto {
  @ApiProperty({
    description: '聊天室名稱',
    example: '聊天室名稱',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: '在聊天室中的使用者',
    example: [1],
  })
  @IsNumber({}, { each: true })
  readonly userIds: number[];
}

export class CreateSingleChatroomDto {
  @ApiProperty({
    description: '聊天室名稱',
    example: '聊天室名稱',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: '在聊天室中的使用者',
    example: 1,
  })
  @IsNumber()
  readonly userId: number;
}
