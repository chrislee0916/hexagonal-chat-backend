import { ApiProperty } from '@nestjs/swagger';
import {
  ErrorDetailResponseDto,
  ErrorResponseDto,
  SuccessResponseDto,
} from 'src/common/dtos/response.dto';

// * 取得聊天室詳細資料
export class ShowChatroomResponseDto {
  @ApiProperty({
    description: '聊天室編號',
    example: 1,
  })
  readonly id: number;

  @ApiProperty({
    description: '聊天室名稱',
    example: 'chris',
  })
  readonly name: string;

  @ApiProperty({
    description: '聊天室logo',
    example: 'eec8e436-0678-4464-9044-631f8a374b6a.png',
  })
  readonly image: string;

  @ApiProperty({
    description: '聊天室中的users',
    example: [
      {
        id: 'chris',
        email: 'email@gmail.com',
        name: 'name',
        image: 'eec8e436-0678-4464-9044-631f8a374b6a.png',
        joinedAt: new Date(),
        lastAckId: 1,
      },
    ],
  })
  readonly users: {
    id: number;
    email: string;
    name: string;
    image: string;
    joinedAt: Date;
    lastAckId: number;
  }[];

  @ApiProperty({
    description: '最新的訊息',
    example: {
      id: 1,
      chatroomId: 1,
      senderId: 1,
      image: 'eec8e436-0678-4464-9044-631f8a374b6a.png',
      content: 'hello',
      createdAt: new Date(),
    },
  })
  readonly newMessage: {
    id: number;
    chatroomId: number;
    senderId: number;
    image: string;
    content: string;
    createdAt: Date;
  };

  @ApiProperty({
    description: '最新收到的訊息id',
    example: 1,
  })
  readonly lastAckId: number;

  @ApiProperty({
    description: '建立時間',
    example: new Date(),
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: '最後更新時間',
    example: new Date(),
  })
  readonly updatedAt: Date;
}

export class SuccessShowChatroomResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: ShowChatroomResponseDto,
    example: ShowChatroomResponseDto,
  })
  readonly data: ShowChatroomResponseDto;
}

// * 找不到此聊天室
class ErrorChatroomNotFoundDetailResponseDto extends ErrorDetailResponseDto {
  @ApiProperty({
    example: '12001 找不到此聊天室',
  })
  readonly message: string;

  @ApiProperty({
    example: 'Not Found',
  })
  readonly error?: string;

  @ApiProperty({
    example: 404,
  })
  readonly statusCode?: number;
}

export class ErrorChatroomNotFoundResponseDto extends ErrorResponseDto {
  @ApiProperty({
    type: ErrorChatroomNotFoundDetailResponseDto,
  })
  readonly detail: ErrorChatroomNotFoundDetailResponseDto;
}
