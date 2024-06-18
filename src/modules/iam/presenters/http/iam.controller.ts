import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignInDto } from './dto/request/sign-in.dto';
import { IamService } from '../../application/iam.service';
import { SignUpCommand } from '../../application/commands/impl/sign-up.command';
import { PasswordConfirmedPipe } from 'src/common/pipes/password-confirmed.pipe';
import {
  ErrorSignUpConflictResponseDto,
  ErrorSignUpPassConfirmedResponseDto,
  SignUpResponseDto,
  SuccessSignUpResponseDto,
} from './dto/response/sign-up.response.dto';
import { SignInCommand } from '../../application/commands/impl/sign-in.command';
import {
  ErrorSignInNotExistResponseDto,
  ErrorSignInPasswordResponseDto,
  SignInResponseDto,
  SuccessSignInResponseDto,
} from './dto/response/sign-in.response.dto';
import { RefreshTokenDto } from './dto/request/refresh-token.dto';
import { RefreshTokenCommand } from '../../application/commands/impl/refresh-token.command';
import {
  ErrorRefreshTokenInvalidResponseDto,
  RefreshTokenResponseDto,
  SuccessRefreshTokenResponseDto,
} from './dto/response/refresh-token.response.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserData } from '../../domain/interfaces/active-user-data.interface';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { AskFriendCommand } from '../../application/commands/impl/ask-friend.command';
import { SuccessResponseDto } from 'src/common/dtos/response.dto';
import { ObjectIdPipe } from 'src/common/pipes/object-id.pipe';
import { AcceptFriendCommand } from '../../application/commands/impl/accept-friend.command';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { IsNumber } from 'class-validator';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';

@ApiTags('IAM - 身分識別與存取管理')
@Auth(AuthType.None)
@ApiBearerAuth()
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
      new SignUpCommand(signUpDto.name, signUpDto.email, signUpDto.password),
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
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
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

  @Get('friends')
  @Auth(AuthType.Bearer)
  friends() {
    return [
      {
        id: 1,
        name: 'name1',
        email: 'email1',
      },
      {
        id: 2,
        name: 'name2',
        email: 'email2',
      },
      {
        id: 3,
        name: 'name3',
        email: 'email3',
      },
    ];
  }

  @ApiOperation({
    summary: '發送新增好友邀請',
  })
  @ApiOkResponse({
    type: SuccessResponseDto,
  })
  @Auth(AuthType.Bearer)
  @Get('ask-friend/:friendId')
  askFriend(
    @ActiveUser() user: ActiveUserData,
    @Param('friendId', new ParseIntPipe()) friendId: number,
  ) {
    if (user.sub === friendId) {
      throw new BadRequestException(ErrorMsg.ERR_AUTH_ASK_FRIEND_TO_MYSELF);
    }
    return this.iamService.askFriend(new AskFriendCommand(user.sub, friendId));
  }

  @ApiOperation({
    summary: '接受好友邀請',
  })
  @ApiOkResponse({
    type: SuccessResponseDto,
  })
  @Auth(AuthType.Bearer)
  @Get('accept-friend/:friendId')
  acceptFriend(
    @ActiveUser() user: ActiveUserData,
    @Param('friendId', new ParseIntPipe()) friendId: number,
  ) {
    return this.iamService.acceptFriend(
      new AcceptFriendCommand(user.sub, friendId),
    );
  }
}
