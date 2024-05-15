import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "src/common/dtos/response.dto";



export class SignInResponseDto {
  @ApiProperty({
    description: '存取令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...'
  })
  readonly accessToken: string;

  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...'
  })
  readonly refreshToken: string;
}


export class SuccessSignInResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: SignInResponseDto
  })
  readonly data: SignInResponseDto;
}