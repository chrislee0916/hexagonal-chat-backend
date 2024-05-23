import { Test, TestingModule } from '@nestjs/testing';
import { IamService } from './iam.service';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from './commands/impl/sign-up.command';
import { User } from '../domain/user';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpResponseDto } from '../presenters/http/dto/response/sign-up.response.dto';
import { SignInCommand } from './commands/impl/sign-in.command';
import { SignInResponseDto } from '../presenters/http/dto/response/sign-in.response.dto';
import { RefreshTokenCommand } from './commands/impl/refresh-token.command';
import { RefreshTokenResponseDto } from '../presenters/http/dto/response/refresh-token.response.dto';
import { AskFriendCommand } from './commands/impl/ask-friend.command';

type MockCommandBus<T = any> = Partial<Record<keyof CommandBus<T>, jest.Mock>>;
const createMockCommandBus = <T = any>(): MockCommandBus<T> => ({
  execute: jest.fn(),
});

describe('IamService', () => {
  let service: IamService;
  let commandBus: MockCommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IamService,
        {
          provide: CommandBus,
          useValue: createMockCommandBus(),
        },
      ],
    }).compile();

    service = module.get<IamService>(IamService);
    commandBus = module.get<MockCommandBus>(CommandBus);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    describe('when user does not exist', () => {
      it('should return the user object', async () => {
        const signUpCommand: SignUpCommand = {
          name: 'chris',
          email: 'example@gmail.com',
          password: 'password',
        };
        const expectRes: SignUpResponseDto = {
          id: 1,
          name: 'chris',
          email: 'example@gmail.com',
        };

        commandBus.execute.mockReturnValue(expectRes);
        const actual = await service.signUp(signUpCommand);
        expect(actual).toEqual(expectRes);
      });
    });

    describe('otherwise', () => {
      it('should throw the conflict exception', async () => {
        const signUpCommand: SignUpCommand = {
          name: 'chris',
          email: 'example@gmail.com',
          password: 'password',
        };

        commandBus.execute.mockRejectedValue(
          new ConflictException('11002 已註冊使用者'),
        );
        try {
          await service.signUp(signUpCommand);
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
        const signInCommand: SignInCommand = {
          email: 'example@gmail.com',
          password: 'password',
        };
        const expectRes: SignInResponseDto = {
          id: 1,
          name: 'name',
          email: signInCommand.email,
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };
        commandBus.execute.mockReturnValue(expectRes);
        const actual: SignInResponseDto = await service.signIn(signInCommand);
        expect(actual).toEqual(expectRes);
      });
    });

    describe('when user not exist', () => {
      it('should throw the unauthorized exception', async () => {
        const signInCommand: SignInCommand = {
          email: 'example@gmail.com',
          password: 'password',
        };

        commandBus.execute.mockRejectedValue(
          new UnauthorizedException('11003 尚未註冊使用者'),
        );
        try {
          await service.signIn(signInCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err.message).toEqual('11003 尚未註冊使用者');
        }
      });
    });

    describe('when password incorrect', () => {
      it('should throw the unauthorized exception', async () => {
        const signInCommand: SignInCommand = {
          email: 'example@gmail.com',
          password: 'password',
        };
        commandBus.execute.mockRejectedValue(
          new UnauthorizedException('11004 密碼錯誤'),
        );
        try {
          await service.signIn(signInCommand);
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
        const refreshTokenCommand: RefreshTokenCommand = {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };
        const expectRes: RefreshTokenResponseDto = {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };
        commandBus.execute.mockReturnValue(expectRes);
        const actual = await service.refreshToken(refreshTokenCommand);
        expect(actual).toEqual(expectRes);
      });
    });

    describe('otherwise', () => {
      it('should throw the unauthorized exception', async () => {
        const refreshTokenCommand: RefreshTokenCommand = {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };

        commandBus.execute.mockRejectedValue(
          new UnauthorizedException('11006 無效刷新令牌'),
        );
        try {
          await service.refreshToken(refreshTokenCommand);
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
        const askFriendCommand: AskFriendCommand = {
          userId: 1,
          friendId: 2,
        };
        commandBus.execute.mockReturnValue(null);
        const actual = await service.askFriend(askFriendCommand);
        expect(actual).toEqual(null);
      });
    });

    describe('when the friendId or user does not exist', () => {
      it('should throw not found exception', async () => {
        const askFriendCommand: AskFriendCommand = {
          userId: 1,
          friendId: 2,
        };
        commandBus.execute.mockRejectedValue(
          new NotFoundException('11007 找不到使用者'),
        );

        try {
          const actual = await service.askFriend(askFriendCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual('11007 找不到使用者');
        }
      });
    });

    describe('when the they are already friend', () => {
      it('should throw conflict exception', async () => {
        const askFriendCommand: AskFriendCommand = {
          userId: 1,
          friendId: 2,
        };
        commandBus.execute.mockRejectedValue(
          new ConflictException('11009 該使用者已經是好友'),
        );

        try {
          const actual = await service.askFriend(askFriendCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
          expect(err.message).toEqual('11009 該使用者已經是好友');
        }
      });
    });

    describe('when already asked friend before', () => {
      it('should throw conflict exception', async () => {
        const askFriendCommand: AskFriendCommand = {
          userId: 1,
          friendId: 2,
        };
        commandBus.execute.mockRejectedValue(
          new ConflictException('11008 已送出好友邀請'),
        );

        try {
          const actual = await service.askFriend(askFriendCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
          expect(err.message).toEqual('11008 已送出好友邀請');
        }
      });
    });
  });
});
