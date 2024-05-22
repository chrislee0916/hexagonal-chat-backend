import { Test, TestingModule } from '@nestjs/testing';
import { IamController } from './iam.controller';
import { IamService } from '../../application/iam.service';
import { PasswordConfirmedPipe } from '../../../../common/pipes/password-confirmed.pipe';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpResponseDto } from './dto/sign-up.response.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in.response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token.response.dto';

type MockIamService = Partial<Record<keyof IamService, jest.Mock>>;
const createMockIamService = (): MockIamService => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
  refreshToken: jest.fn(),
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
});
