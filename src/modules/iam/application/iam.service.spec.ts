import { Test, TestingModule } from '@nestjs/testing';
import { IamService } from './iam.service';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from './commands/sign-up.command';
import { User } from '../domain/user';
import { ConflictException } from '@nestjs/common';
import { SignUpResponseDto } from '../presenters/http/dto/sign-up.response.dto';

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
          email: 'example@gmail.com',
          password: 'password',
        };
        const expectRes: SignUpResponseDto = {
          id: 1,
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
});
