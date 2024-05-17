import { ApiProperty } from '@nestjs/swagger';
import {
  ErrorDetailResponseDto,
  ErrorResponseDto,
  SuccessResponseDto,
} from 'src/common/dtos/response.dto';

// * 成功刷新令牌返回結果
export class RefreshTokenResponseDto {
  @ApiProperty({
    description: '存取令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...',
  })
  readonly accessToken: string;

  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...',
  })
  readonly refreshToken: string;
}

export class SuccessRefreshTokenResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: RefreshTokenResponseDto,
  })
  readonly data: RefreshTokenResponseDto;
}

// * 無效刷新令牌
class ErrorRefreshTokenInvalidDetailResponseDto extends ErrorDetailResponseDto {
  @ApiProperty({
    example: '11006 無效刷新令牌',
  })
  readonly message: string;

  @ApiProperty({
    example: 'Unauthorized',
  })
  readonly error?: string;

  @ApiProperty({
    example: 401,
  })
  readonly statusCode?: number;
}

export class ErrorRefreshTokenInvalidResponseDto extends ErrorResponseDto {
  @ApiProperty({
    type: ErrorRefreshTokenInvalidDetailResponseDto,
  })
  readonly detail: ErrorRefreshTokenInvalidDetailResponseDto;
}
