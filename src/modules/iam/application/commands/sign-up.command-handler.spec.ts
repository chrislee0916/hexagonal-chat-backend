import { Test, TestingModule } from '@nestjs/testing';
import { SignUpCommandHandler } from './sign-up.command-handler';
import { UserFactory } from '../../domain/factories/user.factory';
import { CreateUserRepository } from '../ports/create-user.repository';
import { HashingService } from '../ports/hashing.service';
import { SignUpCommand } from './sign-up.command';
import { User } from '../../domain/user';
import { SignUpResponseDto } from '../../presenters/http/dto/sign-up.response.dto';
import { ConflictException } from '@nestjs/common';
import { ErrorMsg } from '../../../../common/enums/err-msg.enum';

type MockUserFactory = Partial<Record<keyof UserFactory, jest.Mock>>;
const createMockUserFactory = (): MockUserFactory => ({
  create: jest.fn(),
});

type MockCreateUserRepository = Partial<
  Record<keyof CreateUserRepository, jest.Mock>
>;
const createMockCreateUserRepository = (): MockCreateUserRepository => ({
  save: jest.fn(),
});

type MockHashingService = Partial<Record<keyof HashingService, jest.Mock>>;
const createHashingService = (): MockHashingService => ({
  hash: jest.fn(),
  compare: jest.fn(),
});

describe('SignUpCommandHandler', () => {
  let signUpCommandHandler: SignUpCommandHandler;
  let userFactory: MockUserFactory;
  let createUserRepository: MockCreateUserRepository;
  let hashingService: MockHashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpCommandHandler,
        {
          provide: UserFactory,
          useValue: createMockUserFactory(),
        },
        {
          provide: CreateUserRepository,
          useValue: createMockCreateUserRepository(),
        },
        {
          provide: HashingService,
          useValue: createHashingService(),
        },
      ],
    }).compile();

    signUpCommandHandler =
      module.get<SignUpCommandHandler>(SignUpCommandHandler);
    userFactory = module.get<MockUserFactory>(UserFactory);
    createUserRepository =
      module.get<MockCreateUserRepository>(CreateUserRepository);
    hashingService = module.get<MockHashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(signUpCommandHandler).toBeDefined();
  });

  describe('execute', () => {
    describe('when user does not exist', () => {
      it('should return the user object', async () => {
        const signUpCommand: SignUpCommand = {
          email: 'example@gmail.com',
          password: 'password',
        };
        const expectedUser: User = {
          id: 1,
          email: 'example@gmail.com',
          password:
            '$2b$10$.cfl0sfK7uwPmURAKJUwNOuY.2zAJy90.QQntEy5GzcJN9gjkDKHW',
        };
        const expectRes: SignUpResponseDto = {
          id: expectedUser.id,
          email: expectedUser.email,
        };
        hashingService.hash.mockReturnValue(expectedUser.password);
        userFactory.create.mockReturnValue({
          email: expectedUser.email,
          passowrd: expectedUser.password,
        });
        createUserRepository.save.mockReturnValue({
          id: expectedUser.id,
          email: expectedUser.email,
          password: expectedUser.password,
        });

        const actual = await signUpCommandHandler.execute(signUpCommand);
        expect(actual).toEqual(expectRes);
      });
    });

    describe('otherwise', () => {
      it('should throw the conflict exception', async () => {
        const signUpCommand: SignUpCommand = {
          email: 'example@gmail.com',
          password: 'password',
        };
        const expectedUser: User = {
          id: 1,
          email: 'example@gmail.com',
          password:
            '$2b$10$.cfl0sfK7uwPmURAKJUwNOuY.2zAJy90.QQntEy5GzcJN9gjkDKHW',
        };

        hashingService.hash.mockReturnValue(expectedUser.password);
        userFactory.create.mockReturnValue({
          email: expectedUser.email,
          passowrd: expectedUser.password,
        });
        createUserRepository.save.mockReturnValue(
          new ConflictException(ErrorMsg.ERR_AUTH_SIGNUP_USER_CONFLICT),
        );
        try {
          await signUpCommandHandler.execute(signUpCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
          expect(err.message).toEqual(ErrorMsg.ERR_AUTH_SIGNUP_USER_CONFLICT);
        }
      });
    });
  });
});
