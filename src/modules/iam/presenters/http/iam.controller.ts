import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IamService } from '../../application/iam.service';
import { SignUpCommand } from '../../application/commands/sign-up.command';
import { PasswordConfirmedPipe } from 'src/common/pipes/password-confirmed.pipe';

@ApiTags('IAM - 身分識別與存取管理')
@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @ApiOperation({
    summary: '註冊使用者',
  })
  @ApiCreatedResponse({
    type: SignUpDto,
  })
  @ApiBody({
    type: SignUpDto,
  })
  @Post('sign-up')
  signUp(@Body(new PasswordConfirmedPipe()) signUpDto: SignUpDto) {
    return this.iamService.signUp(
      new SignUpCommand(signUpDto.email, signUpDto.password),
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return signInDto;
  }
}
