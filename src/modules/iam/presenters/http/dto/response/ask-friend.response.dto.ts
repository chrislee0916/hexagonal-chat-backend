import { ApiProperty } from '@nestjs/swagger';
import {
  ErrorDetailResponseDto,
  ErrorResponseDto,
} from 'src/common/dtos/response.dto';

// * 無效的email
class ErrorEmailInvalidDetailResponseDto extends ErrorDetailResponseDto {
  @ApiProperty({
    example: '10004 網址參數須為email',
  })
  readonly message: string;

  @ApiProperty({
    example: 'Bad Request',
  })
  readonly error?: string;

  @ApiProperty({
    example: 400,
  })
  readonly statusCode?: number;
}

export class ErrorEmailInvalidResponseDto extends ErrorResponseDto {
  @ApiProperty({
    type: ErrorEmailInvalidDetailResponseDto,
  })
  readonly detail: ErrorEmailInvalidDetailResponseDto;
}

// * 找不到該 user
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

// * 不能加自己為好友
class ErrorAddToYouselfDetailResponseDto extends ErrorDetailResponseDto {
  @ApiProperty({
    example: '11011 不能添加自己為朋友',
  })
  readonly message: string;

  @ApiProperty({
    example: 'Bad Request',
  })
  readonly error?: string;

  @ApiProperty({
    example: 400,
  })
  readonly statusCode?: number;
}

export class ErrorAddToYouselfResponseDto extends ErrorResponseDto {
  @ApiProperty({
    type: ErrorAddToYouselfDetailResponseDto,
  })
  readonly detail: ErrorAddToYouselfDetailResponseDto;
}
