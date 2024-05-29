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

export class SuccessSignUpResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: CreateChatroomResponseDto,
    example: CreateChatroomResponseDto,
  })
  readonly data: CreateChatroomResponseDto;
}
