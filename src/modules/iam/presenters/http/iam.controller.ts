import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IamService } from '../../application/iam.service';
import { SignUpCommand } from '../../application/commands/sign-up.command';
import { PasswordConfirmedPipe } from '../../domain/pipes/password-confirmed.pipe';
import {
  ErrorSignUpConflictResponseDto,
  ErrorSignUpPassConfirmedResponseDto,
  SignUpResponseDto,
  SuccessSignUpResponseDto,
} from './dto/sign-up.response.dto';
import { SignInQuery } from '../../application/queries/sign-in.query';
import { SuccessSignInResponseDto } from './dto/sign-in.response.dto';

@ApiTags('IAM - 身分識別與存取管理')
@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) { }

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
    summary: '登入使用者'
  })
  @ApiOkResponse({
    type: SuccessSignInResponseDto
  })
  @ApiBody({
    type: SignInDto
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.iamService.signIn(
      new SignInQuery(
        signInDto.email,
        signInDto.password,
      )
    )
  }
}
