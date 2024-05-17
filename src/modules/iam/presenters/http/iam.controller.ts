import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  PartialType,
  getSchemaPath,
  refs,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IamService } from '../../application/iam.service';
import { SignUpCommand } from '../../application/commands/impl/sign-up.command';
import { PasswordConfirmedPipe } from '../../domain/pipes/password-confirmed.pipe';
import {
  ErrorSignUpConflictResponseDto,
  ErrorSignUpPassConfirmedResponseDto,
  SignUpResponseDto,
  SuccessSignUpResponseDto,
} from './dto/sign-up.response.dto';
import { SignInCommand } from '../../application/commands/impl/sign-in.command';
import {
  ErrorSignInNotExistResponseDto,
  ErrorSignInPasswordResponseDto,
  SignInResponseDto,
  SuccessSignInResponseDto,
} from './dto/sign-in.response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenCommand } from '../../application/commands/impl/refresh-token.command';
import {
  ErrorRefreshTokenInvalidResponseDto,
  RefreshTokenResponseDto,
  SuccessRefreshTokenResponseDto,
} from './dto/refresh-token.response.dto';

@ApiTags('IAM - 身分識別與存取管理')
@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @ApiOperation({
    summary: '註冊使用者',
  })
  @ApiCreatedResponse({
    type: SuccessSignUpResponseDto,
  })
  @ApiBadRequestResponse({
    type: ErrorSignUpPassConfirmedResponseDto,
  })
  @ApiConflictResponse({
    type: ErrorSignUpConflictResponseDto,
  })
  @ApiBody({
    type: SignUpDto,
  })
  @Post('sign-up')
  async signUp(
    @Body(new PasswordConfirmedPipe()) signUpDto: SignUpDto,
  ): Promise<SignUpResponseDto> {
    return this.iamService.signUp(
      new SignUpCommand(signUpDto.email, signUpDto.password),
    );
  }

  @ApiOperation({
    summary: '登入使用者',
  })
  @ApiOkResponse({
    type: SuccessSignInResponseDto,
  })
  @ApiExtraModels(
    ErrorSignInNotExistResponseDto,
    ErrorSignInPasswordResponseDto,
  )
  @ApiUnauthorizedResponse({
    schema: {
      anyOf: refs(
        ErrorSignInNotExistResponseDto,
        ErrorSignInPasswordResponseDto,
      ),
    },
  })
  @ApiBody({
    type: SignInDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.iamService.signIn(
      new SignInCommand(signInDto.email, signInDto.password),
    );
  }

  @ApiOperation({
    summary: '刷新令牌',
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiOkResponse({
    type: SuccessRefreshTokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorRefreshTokenInvalidResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.iamService.refreshToken(
      new RefreshTokenCommand(refreshTokenDto.refreshToken),
    );
  }
}
