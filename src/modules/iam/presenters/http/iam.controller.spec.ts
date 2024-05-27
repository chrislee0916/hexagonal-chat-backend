import { Test, TestingModule } from '@nestjs/testing';
import { IamController } from './iam.controller';
import { IamService } from '../../application/iam.service';
import { PasswordConfirmedPipe } from '../../../../common/pipes/password-confirmed.pipe';
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignUpResponseDto } from './dto/response/sign-up.response.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/request/sign-in.dto';
import { SignInResponseDto } from './dto/response/sign-in.response.dto';
import { RefreshTokenDto } from './dto/request/refresh-token.dto';
import { RefreshTokenResponseDto } from './dto/response/refresh-token.response.dto';
import { ActiveUserData } from '../../domain/interfaces/active-user-data.interface';
import { SuccessResponseDto } from 'src/common/dtos/response.dto';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';

type MockIamService = Partial<Record<keyof IamService, jest.Mock>>;
const createMockIamService = (): MockIamService => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
  refreshToken: jest.fn(),
  askFriend: jest.fn(),
});

type MockPasswordConfirmedPipe = Partial<
  Record<keyof PasswordConfirmedPipe, jest.Mock>
>;
const createMockPasswordConfirmedPipe = (): MockPasswordConfirmedPipe => ({
  transform: jest.fn(),
});

describe('IamController', () => {
  let controller: IamController;
  let iamService: MockIamService;
  let passwordConfirmedPipe: MockPasswordConfirmedPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IamController],
      providers: [
        {
          provide: IamService,
          useValue: createMockIamService(),
        },
        {
          provide: PasswordConfirmedPipe,
          useValue: createMockPasswordConfirmedPipe(),
        },
      ],
    }).compile();

    controller = module.get<IamController>(IamController);
    iamService = module.get<MockIamService>(IamService);
    passwordConfirmedPipe = module.get<MockPasswordConfirmedPipe>(
      PasswordConfirmedPipe,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    describe('when user does not exist', () => {
      it('should return the user object', async () => {
        const signUpDto: SignUpDto = {
          name: 'chris',
          email: 'example@gmail.com',
          password: 'password',
          password_confirmed: 'password',
        };
        const expectRes: SignUpResponseDto = {
          id: 1,
          name: 'chris',
          email: signUpDto.email,
        };
        passwordConfirmedPipe.transform.mockReturnValue(signUpDto);
        iamService.signUp.mockReturnValue(expectRes);
        const actual = await controller.signUp(signUpDto);
        expect(actual).toEqual(expectRes);
      });
    });

    describe('otherwise', () => {
      it('should throw the conflict exception', async () => {
        const signUpDto: SignUpDto = {
          name: 'chris',
          email: 'exmaple@gmail.com',
          password: 'password',
          password_confirmed: 'password',
        };
        passwordConfirmedPipe.transform.mockReturnValue(signUpDto);
        iamService.signUp.mockRejectedValue(
          new ConflictException('11002 已註冊使用者'),
        );
        try {
          await controller.signUp(signUpDto);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
          expect(err.message).toEqual('11002 已註冊使用者');
        }
      });
    });
  });

  describe('signIn', () => {
    describe('when user exist and password correct', () => {
      it('should return the token object', async () => {
        const signInDto: SignInDto = {
          email: 'example@gmail.com',
          password: 'password',
        };
        const expectRes: SignInResponseDto = {
          id: 1,
          name: 'name',
          email: signInDto.email,
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };
        iamService.signIn.mockReturnValue(expectRes);
        const actual = await controller.signIn(signInDto);
        expect(actual).toEqual(expectRes);
      });
    });

    describe('when user not exist', () => {
      it('should throw the unauthorized exception', async () => {
        const signInDto: SignInDto = {
          email: 'example@gmail.com',
          password: 'password',
        };

        iamService.signIn.mockRejectedValue(
          new UnauthorizedException('11003 尚未註冊使用者'),
        );
        try {
          await controller.signIn(signInDto);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err.message).toEqual('11003 尚未註冊使用者');
        }
      });
    });

    describe('when password incorrect', () => {
      it('should throw the unauthorized exception', async () => {
        const signInDto: SignInDto = {
          email: 'example@gmail.com',
          password: 'password',
        };
        iamService.signIn.mockRejectedValue(
          new UnauthorizedException('11004 密碼錯誤'),
        );
        try {
          await controller.signIn(signInDto);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err.message).toEqual('11004 密碼錯誤');
        }
      });
    });
  });

  describe('refreshTokens', () => {
    describe('when refresh token valid', () => {
      it('should return the token object', async () => {
        const refreshTokenDto: RefreshTokenDto = {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };
        const expectRes: RefreshTokenResponseDto = {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };
        iamService.refreshToken.mockReturnValue(expectRes);
        const actual = await controller.refreshTokens(refreshTokenDto);
        expect(actual).toEqual(expectRes);
      });
    });

    describe('otherwise', () => {
      it('should throw the unauthorized exception', async () => {
        const refreshTokenDto: RefreshTokenDto = {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };

        iamService.refreshToken.mockRejectedValue(
          new UnauthorizedException('11006 無效刷新令牌'),
        );
        try {
          await controller.refreshTokens(refreshTokenDto);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err.message).toEqual('11006 無效刷新令牌');
        }
      });
    });
  });

  describe('askFriend', () => {
    describe('when token valid and friendId exists', () => {
      it('should return null', async () => {
        const user: ActiveUserData = {
          sub: 1,
          email: 'example@gmail.com',
        };
        const friendId = 2;
        iamService.askFriend.mockReturnValue(null);
        const actual = await controller.askFriend(user, friendId);
        expect(actual).toEqual(null);
      });
    });

    describe('when the friendId or user does not exist', () => {
      it('should throw not found exception', async () => {
        const user: ActiveUserData = {
          sub: 1,
          email: 'example@gmail.com',
        };
        const friendId = 2;
        iamService.askFriend.mockRejectedValue(
          new NotFoundException('11007 找不到使用者'),
        );
        try {
          const actual = await controller.askFriend(user, friendId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual('11007 找不到使用者');
        }
      });
    });

    describe('when they are already been friend', () => {
      it('should throw conflict exception', async () => {
        const user: ActiveUserData = {
          sub: 1,
          email: 'example@gmail.com',
        };
        const friendId = 2;
        iamService.askFriend.mockRejectedValue(
          new ConflictException('11009 該使用者已經是好友'),
        );
        try {
          const actual = await controller.askFriend(user, friendId);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
          expect(err.message).toEqual('11009 該使用者已經是好友');
        }
      });
    });

    describe('when already asked friend before', () => {
      it('should throw conflict exception', async () => {
        const user: ActiveUserData = {
          sub: 1,
          email: 'example@gmail.com',
        };
        const friendId = 2;
        iamService.askFriend.mockRejectedValue(
          new ConflictException('11008 已送出好友邀請'),
        );
        try {
          const actual = await controller.askFriend(user, friendId);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
          expect(err.message).toEqual('11008 已送出好友邀請');
        }
      });
    });
  });

  describe('accept', () => {
    describe('when token valid and ask exists', () => {});
    describe('when the ask does not exist', () => {});
    describe('when they are already been friend', () => {});
  });
});
