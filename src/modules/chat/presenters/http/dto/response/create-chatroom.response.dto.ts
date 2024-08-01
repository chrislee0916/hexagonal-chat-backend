import { ApiProperty } from '@nestjs/swagger';
import {
  ErrorDetailResponseDto,
  ErrorResponseDto,
  SuccessResponseDto,
} from 'src/common/dtos/response.dto';

// * 成功建立聊天室返回結果
export class CreateChatroomResponseDto {
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
}

export class SuccessCreateChatroomResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: CreateChatroomResponseDto,
    example: CreateChatroomResponseDto,
  })
  readonly data: CreateChatroomResponseDto;
}

// * 找不到用戶
class ErrorUserNotFoundDetailResponseDto extends ErrorDetailResponseDto {
  @ApiProperty({
    example: '11007 找不到使用者',
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

export class ErrorUserNotFoundResponseDto extends ErrorResponseDto {
  @ApiProperty({
    type: ErrorUserNotFoundDetailResponseDto,
  })
  readonly detail: ErrorUserNotFoundDetailResponseDto;
}
