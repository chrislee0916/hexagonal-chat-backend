import { ApiProperty } from '@nestjs/swagger';
import {
  ErrorDetailResponseDto,
  ErrorResponseDto,
} from 'src/common/dtos/response.dto';

// * 找不到好友邀請
class ErrorAskNotFoundDetailResponseDto extends ErrorDetailResponseDto {
  @ApiProperty({
    example: '11010 找不到此好友邀請',
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

export class ErrorAskNotFoundResponseDto extends ErrorResponseDto {
  @ApiProperty({
    type: ErrorAskNotFoundDetailResponseDto,
  })
  readonly detail: ErrorAskNotFoundDetailResponseDto;
}
