import { ApiProperty } from '@nestjs/swagger';
import {
  ErrorDetailResponseDto,
  ErrorResponseDto,
  SuccessResponseDto,
} from 'src/common/dtos/response.dto';

// * 成功登入返回結果
export class SignInResponseDto {
  @ApiProperty({
    description: '使用者id',
    example: 1,
  })
  readonly id: number;

  @ApiProperty({
    description: '使用者電子信箱',
    example: 'example@gmail.com',
  })
  readonly email: string;

  @ApiProperty({
    description: '使用者名稱',
    example: 'name',
  })
  readonly name: string;

  readonly image: string;

  readonly expireIn: number;

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

export class SuccessSignInResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: SignInResponseDto,
    example: SignInResponseDto,
  })
  readonly data: SignInResponseDto;
}

// * 使用者不存在
class ErrorSignInNotExistDetailResponseDto extends ErrorDetailResponseDto {
  @ApiProperty({
    example: '11003 尚未註冊使用者',
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

export class ErrorSignInNotExistResponseDto extends ErrorResponseDto {
  @ApiProperty({
    type: ErrorSignInNotExistDetailResponseDto,
  })
  readonly detail: ErrorSignInNotExistDetailResponseDto;
}

// * 登入密碼錯誤
class ErrorSignInPasswordDetailResponseDto extends ErrorDetailResponseDto {
  @ApiProperty({
    example: '11004 密碼錯誤',
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

export class ErrorSignInPasswordResponseDto extends ErrorResponseDto {
  @ApiProperty({
    type: ErrorSignInPasswordDetailResponseDto,
  })
  readonly detail: ErrorSignInPasswordDetailResponseDto;
}
