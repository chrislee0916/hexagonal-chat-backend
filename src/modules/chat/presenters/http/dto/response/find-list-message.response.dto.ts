import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dtos/response.dto';

// * 取得聊天室詳細資料
export class FindListMessageResponseDto {
  @ApiProperty({
    description: '聊天訊息流水號',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '聊天室id',
    example: 1,
  })
  chatroomId: number;

  @ApiProperty({
    description: '聊天文字內容',
    example: 'hello',
  })
  content: string;

  @ApiProperty({
    description: '聊天圖片內容',
    example: 'eec8e436-0678-4464-9044-631f8a374b6a.png',
  })
  image: string;

  @ApiProperty({
    description: '發送者id',
    example: 1,
  })
  senderId: number;

  @ApiProperty({
    description: '發送時間',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: '最後更新時間',
    example: new Date(),
  })
  updatedAt: Date;
}

export class SuccessShowChatroomResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: [FindListMessageResponseDto],
    example: [FindListMessageResponseDto],
  })
  readonly data: FindListMessageResponseDto[];
}
