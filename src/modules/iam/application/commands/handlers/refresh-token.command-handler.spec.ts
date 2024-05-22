import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from '../../ports/hashing.service';
import { FindUserRepository } from '../../ports/find-user.repository';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenIdsStorage } from '../../ports/refresh-token-ids.storage';
import { SignInCommand } from '../impl/sign-in.command';
import { User } from 'src/modules/iam/domain/user';
import { SignInResponseDto } from 'src/modules/iam/presenters/http/dto/sign-in.response.dto';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenCommandHandler } from './refresh-token.command-handler';
import { RefreshTokenCommand } from '../impl/refresh-token.command';
import { RefreshTokenResponseDto } from 'src/modules/iam/presenters/http/dto/refresh-token.response.dto';

type MockHashingService = Partial<Record<keyof HashingService, jest.Mock>>;
const createMockHashingService = (): MockHashingService => ({
  hash: jest.fn(),
  compare: jest.fn(),
});

type MockFindUserRepository = Record<keyof FindUserRepository, jest.Mock>;
const createMockFindUserRepository = (): MockFindUserRepository => ({
  findOneByEmail: jest.fn(),
  findOneById: jest.fn(),
});

type MockJwtService = Partial<Record<keyof JwtService, jest.Mock>>;
const createMockJwtService = (): MockJwtService => ({
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
});

type MockRefreshTokenIdsStorage = Record<
  keyof RefreshTokenIdsStorage,
  jest.Mock
>;

const createMockRefreshTokenIdsStorage = (): MockRefreshTokenIdsStorage => ({
  insert: jest.fn(),
  validate: jest.fn(),
  invalidate: jest.fn(),
  generateTokens: jest.fn(),
});

describe('RefreshTokenCommandHandler', () => {
  let refreshTokenCommandHandler: RefreshTokenCommandHandler;
  let findUserRepository: MockFindUserRepository;
  let hashingService: MockHashingService;
  let jwtService: MockJwtService;
  let refreshTokenIdsStorage: MockRefreshTokenIdsStorage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenCommandHandler,
        {
          provide: FindUserRepository,
          useValue: createMockFindUserRepository(),
        },
        {
          provide: HashingService,
          useValue: createMockHashingService(),
        },
        {
          provide: JwtService,
          useValue: createMockJwtService(),
        },
        {
          provide: RefreshTokenIdsStorage,
          useValue: createMockRefreshTokenIdsStorage(),
        },
      ],
    }).compile();

    refreshTokenCommandHandler = module.get<RefreshTokenCommandHandler>(
      RefreshTokenCommandHandler,
    );
    findUserRepository = module.get<MockFindUserRepository>(FindUserRepository);
    hashingService = module.get<MockHashingService>(HashingService);
    jwtService = module.get<MockJwtService>(JwtService);
    refreshTokenIdsStorage = module.get<MockRefreshTokenIdsStorage>(
      RefreshTokenIdsStorage,
    );
  });

  it('should be defined', () => {
    expect(refreshTokenCommandHandler).toBeDefined();
  });

  describe('execute', () => {
    describe('when refresh token valid', () => {
      it('should return the token object', async () => {
        const refreshTokenCommand: RefreshTokenCommand = {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };
        const expectTokenData = {
          sub: 1,
          refreshTokenId: '7e7e2222-fa6b-4a9b-9776-17a111460b44',
        };
        const expectUser: Partial<User> = {
          id: expectTokenData.sub,
          name: 'chris',
          email: 'example@gmail.com',
          password:
            '$2b$10$.cfl0sfK7uwPmURAKJUwNOuY.2zAJy90.QQntEy5GzcJN9gjkDKHW',
        };
        const expectRes: RefreshTokenResponseDto = {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };

        jwtService.verifyAsync.mockReturnValue(expectTokenData);
        findUserRepository.findOneById.mockReturnValue(expectUser);
        refreshTokenIdsStorage.validate.mockReturnValue(true);
        refreshTokenIdsStorage.invalidate.mockReturnValue(null);
        jwtService.signAsync.mockReturnValue(expectRes.accessToken);
        refreshTokenIdsStorage.generateTokens.mockReturnValue(expectRes);
        const actual =
          await refreshTokenCommandHandler.execute(refreshTokenCommand);
        expect(actual).toEqual(expectRes);
      });
    });

    describe('otherwise', () => {
      it('should throw the unauthorized exception', async () => {
        const refreshTokenCommand: RefreshTokenCommand = {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };

        // * In any of the following scenarios
        jwtService.verifyAsync.mockRejectedValue(
          new UnauthorizedException('11006 無效刷新令牌'),
        );

        refreshTokenIdsStorage.validate.mockRejectedValue(
          new UnauthorizedException('11006 無效刷新令牌'),
        );

        try {
          await refreshTokenCommandHandler.execute(refreshTokenCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err.message).toEqual('11006 無效刷新令牌');
        }
      });
    });
  });
});
