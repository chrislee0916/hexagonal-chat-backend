import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from '../../ports/hashing.service';
import { SignInCommandHandler } from './sign-in.command-handler';
import { FindUserRepository } from '../../ports/find-user.repository';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenIdsStorage } from '../../ports/refresh-token-ids.storage';
import { SignInCommand } from '../impl/sign-in.command';
import { User } from 'src/modules/iam/domain/user';
import { SignInResponseDto } from 'src/modules/iam/presenters/http/dto/response/sign-in.response.dto';
import { UnauthorizedException } from '@nestjs/common';

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

describe('SignInCommandHandler', () => {
  let signInCommandHandler: SignInCommandHandler;
  let findUserRepository: MockFindUserRepository;
  let hashingService: MockHashingService;
  let refreshTokenIdsStorage: MockRefreshTokenIdsStorage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInCommandHandler,
        {
          provide: FindUserRepository,
          useValue: createMockFindUserRepository(),
        },
        {
          provide: HashingService,
          useValue: createMockHashingService(),
        },
        {
          provide: RefreshTokenIdsStorage,
          useValue: createMockRefreshTokenIdsStorage(),
        },
      ],
    }).compile();

    signInCommandHandler =
      module.get<SignInCommandHandler>(SignInCommandHandler);
    findUserRepository = module.get<MockFindUserRepository>(FindUserRepository);
    hashingService = module.get<MockHashingService>(HashingService);
    refreshTokenIdsStorage = module.get<MockRefreshTokenIdsStorage>(
      RefreshTokenIdsStorage,
    );
  });

  it('should be defined', () => {
    expect(signInCommandHandler).toBeDefined();
  });

  describe('execute', () => {
    describe('when user exist and password correct', () => {
      it('should return the token object', async () => {
        const signInCommand: SignInCommand = {
          email: 'example@gmail.com',
          password: 'password',
        };
        const expectedUser = {
          id: 1,
          name: 'chris',
          email: signInCommand.email,
          password:
            '$2b$10$.cfl0sfK7uwPmURAKJUwNOuY.2zAJy90.QQntEy5GzcJN9gjkDKHW',
        };
        const expectRes: SignInResponseDto = {
          id: expectedUser.id,
          name: expectedUser.name,
          email: expectedUser.email,
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        };

        findUserRepository.findOneByEmail.mockReturnValue(expectedUser);
        hashingService.compare.mockReturnValue(true);
        refreshTokenIdsStorage.generateTokens.mockReturnValue({
          accessToken: expectRes.accessToken,
          refreshToken: expectRes.refreshToken,
        });

        const actual = await signInCommandHandler.execute(signInCommand);
        expect(actual).toEqual(expectRes);
      });
    });

    describe('when user not exist', () => {
      it('should throw the unauthoraized exception', async () => {
        const signInCommand: SignInCommand = {
          email: 'example@gmail.com',
          password: 'password',
        };
        findUserRepository.findOneByEmail.mockRejectedValue(
          new UnauthorizedException('11003 尚未註冊使用者'),
        );
        try {
          await signInCommandHandler.execute(signInCommand);
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
        const expectedUser = {
          id: 1,
          name: 'chris',
          email: signInCommand.email,
          password:
            '$2b$10$.cfl0sfK7uwPmURAKJUwNOuY.2zAJy90.QQntEy5GzcJN9gjkDKHW',
        };

        findUserRepository.findOneByEmail.mockReturnValue(expectedUser);
        hashingService.compare.mockReturnValue(false);

        try {
          await signInCommandHandler.execute(signInCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err.message).toEqual('11004 密碼錯誤');
        }
      });
    });
  });
});
