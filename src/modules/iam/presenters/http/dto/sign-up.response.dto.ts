import { ConflictException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  ErrorDetailResponseDto,
  ErrorResponseDto,
  SuccessResponseDto,
} from '../../../../../common/dtos/response.dto';

// * 成功註冊返回結果
export class SignUpResponseDto {
  @ApiProperty({
    description: '使用者編號',
    example: 123,
  })
  readonly id: number;

  @ApiProperty({
    description: '電子信箱',
    example: 'example@gmail.com',
  })
  readonly email: string;
}

export class SuccessSignUpResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: SignUpResponseDto,
  })
  readonly data: SignUpResponseDto;
}

// * 使用者已存在
class ErrorSignUpConflictDetailResponseDto extends ErrorDetailResponseDto {
  @ApiProperty({
    example: '11002 已註冊使用者',
  })
  readonly message: string;

  @ApiProperty({
    example: 'Conflict',
  })
  readonly error?: string;

  @ApiProperty({
    example: 409,
  })
  readonly statusCode?: number;
}

export class ErrorSignUpConflictResponseDto extends ErrorResponseDto {
  @ApiProperty({
    type: ErrorSignUpConflictDetailResponseDto,
  })
  readonly detail: ErrorSignUpConflictDetailResponseDto;
}

// * 確認密碼不符合
class ErrorSignUpPassConfirmedDetailResponseDto extends ErrorDetailResponseDto {
  @ApiProperty({
    example: '11005 確認密碼錯誤',
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

export class ErrorSignUpPassConfirmedResponseDto extends ErrorResponseDto {
  @ApiProperty({
    type: ErrorSignUpPassConfirmedDetailResponseDto,
  })
  readonly detail: ErrorSignUpPassConfirmedDetailResponseDto;
}
